import {EntityManager, FlushMode, IsolationLevel} from "@mikro-orm/core";
import {Inject, InjectorService, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {Logger} from "@tsed/logger";

import {DEFAULT_CONTEXT_NAME} from "../constants.js";
import {RetryStrategy} from "../interfaces/RetryStrategy.js";
import {MikroOrmContext} from "../services/MikroOrmContext.js";
import {MikroOrmRegistry} from "../services/MikroOrmRegistry.js";

export interface TransactionOptions {
  retry?: boolean;
  disabled?: boolean;
  isolationLevel?: IsolationLevel;
  flushMode?: FlushMode;
  contextName?: string;
}

type TransactionSettings = Omit<TransactionOptions, "contextName"> & Required<Pick<TransactionOptions, "contextName">>;

@Interceptor()
export class TransactionalInterceptor implements InterceptorMethods {
  constructor(
    @Inject() private readonly injector: InjectorService,
    @Inject() private readonly registry: MikroOrmRegistry,
    @Inject() private readonly context: MikroOrmContext,
    @Inject() private readonly logger: Logger,
    @Inject(RetryStrategy)
    private readonly retryStrategy?: RetryStrategy
  ) {}

  public intercept(context: InterceptorContext<unknown>, next: InterceptorNext) {
    const options = this.extractContextName(context.options);

    if (options.retry && !this.retryStrategy) {
      this.logger.warn(`To retry a transaction you have to implement a "${RetryStrategy.description}" interface`);
    }

    return this.context.has(options.contextName) ? this.runWithinCtx(next, options) : this.runWithinNewCtx(next, options);
  }

  private runWithinCtx(next: InterceptorNext, options: TransactionSettings): Promise<unknown> {
    const callback = () => this.executeInTransaction(next, options);

    return options.retry && this.retryStrategy ? this.retryStrategy.acquire(callback) : callback();
  }

  private async runWithinNewCtx(next: InterceptorNext, options: TransactionSettings): Promise<unknown> {
    const em = await this.getGlobalEntityManager(options.contextName);

    return this.context.run([em], () => this.runWithinCtx(next, options));
  }

  private getGlobalEntityManager(contextName: string = DEFAULT_CONTEXT_NAME): EntityManager {
    const orm = this.registry.get(contextName);

    if (!orm) {
      throw new Error(
        `No such context: ${contextName}. Please register a corresponding MikroOrm instance using '@Configuration()' decorator.`
      );
    }

    return orm.em;
  }

  private extractContextName(options: TransactionOptions | string | undefined): TransactionSettings {
    if (typeof options === "string") {
      return {
        contextName: options
      };
    }

    const {flushMode, isolationLevel, contextName = DEFAULT_CONTEXT_NAME, retry = false, disabled = false} = options ?? {};

    return {
      contextName,
      retry,
      disabled,
      flushMode,
      isolationLevel
    };
  }

  private async executeInTransaction(next: InterceptorNext, options: TransactionSettings): Promise<unknown> {
    const em = this.getEntityManager(options.contextName);

    if (options.disabled) {
      return next();
    }

    const result = await em.transactional(() => this.executeHandlerDelegate(next, options), {
      flushMode: options.flushMode,
      isolationLevel: options.isolationLevel
    });

    await this.afterTransactionCommit(options);

    return result;
  }

  private async executeHandlerDelegate(next: InterceptorNext, options: TransactionSettings): Promise<unknown> {
    const result = await next();
    await this.beforeTransactionCommit(options);
    return result;
  }

  private beforeTransactionCommit(options: TransactionSettings): Promise<unknown> {
    return this.injector.alterAsync("$beforeTransactionCommit", this.getEntityManager(options.contextName));
  }

  private afterTransactionCommit(options: TransactionSettings): Promise<unknown> {
    const em = this.getGlobalEntityManager(options.contextName);

    return this.context.run([em], () => {
      const forkedEm = this.getEntityManager(options.contextName);
      forkedEm.resetTransactionContext();

      return this.injector.alterAsync("$afterTransactionCommit", forkedEm);
    });
  }

  private getEntityManager(contextName: string = DEFAULT_CONTEXT_NAME): EntityManager {
    const em = this.context.get(contextName);

    if (!em) {
      throw new Error(`No such context: ${contextName}. Please check if the async context is lost in one of the asynchronous operations.`);
    }

    return em;
  }
}
