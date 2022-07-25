import {Inject, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {RetryStrategy} from "../services/RetryStrategy";
import {MikroOrmContext} from "../services/MikroOrmContext";
import {MikroOrmRegistry} from "../services/MikroOrmRegistry";
import {FlushMode, IsolationLevel} from "@mikro-orm/core";

export interface TransactionOptions {
  retry?: boolean;
  disabled?: boolean;
  isolationLevel?: IsolationLevel;
  flushMode?: FlushMode;
  contextName?: string;
  /**
   * @deprecated Since 2022-02-01. Use {@link contextName} instead
   */
  connectionName?: string;
}

type TransactionSettings = Required<Omit<TransactionOptions, "connectionName" | "flushMode">> & {flushMode?: FlushMode};

@Interceptor()
export class TransactionalInterceptor implements InterceptorMethods {
  constructor(
    @Inject() private readonly registry: MikroOrmRegistry,
    @Inject() private readonly context: MikroOrmContext,
    @Inject() private readonly logger: Logger,
    @Inject(RetryStrategy)
    private readonly retryStrategy?: RetryStrategy
  ) {}

  public async intercept(context: InterceptorContext<unknown>, next: InterceptorNext): Promise<unknown> {
    const options = this.extractContextName(context);

    if (options.retry && !this.retryStrategy) {
      this.logger.warn(`To retry a transaction you have to implement a "${RetryStrategy.description}" interface`);
    }

    if (this.context.has(options.contextName)) {
      return this.runWithinCtx(next, options);
    }

    return this.runWithinNewCtx(next, options);
  }

  private runWithinCtx(next: InterceptorNext, options: TransactionSettings): Promise<unknown> | unknown {
    const callback = () => this.executeInTransaction(next, options);

    return options.retry && this.retryStrategy ? this.retryStrategy.acquire(callback) : callback();
  }

  private runWithinNewCtx(next: InterceptorNext, options: TransactionSettings): Promise<unknown> | unknown {
    const orm = this.registry.get(options.contextName);

    if (!orm) {
      throw new Error(
        `No such context: ${options.contextName}. Please register a corresponding MikroOrm instance using '@Configuration()' decorator.`
      );
    }

    return this.context.run([orm.em], () => this.runWithinCtx(next, options));
  }

  private extractContextName(context: InterceptorContext<unknown>): TransactionSettings {
    const options = (context.options || {}) as TransactionOptions | string;

    let isolationLevel: IsolationLevel | undefined;
    let disabled: boolean | undefined;
    let contextName: string | undefined;
    let flushMode: FlushMode | undefined;
    let retry: boolean | undefined;

    if (typeof options === "string") {
      contextName = options;
    } else if (options) {
      contextName = options.contextName ?? options.connectionName;
      isolationLevel = options.isolationLevel;
      retry = options.retry;
      disabled = options.disabled;
      flushMode = options.flushMode;
    }

    return {
      flushMode,
      retry: retry ?? false,
      disabled: disabled ?? false,
      contextName: contextName ?? "default",
      isolationLevel: isolationLevel ?? IsolationLevel.READ_COMMITTED
    };
  }

  private async executeInTransaction(next: InterceptorNext, options: TransactionSettings): Promise<unknown> {
    const manager = this.context.get(options.contextName);

    if (!manager) {
      throw new Error(
        `No such context: ${options.contextName}. Please check if the async context is lost in one of the asynchronous operations.`
      );
    }

    if (options.disabled) {
      return next();
    }

    return manager.transactional(() => next(), {
      flushMode: options.flushMode,
      isolationLevel: options.isolationLevel
    });
  }
}
