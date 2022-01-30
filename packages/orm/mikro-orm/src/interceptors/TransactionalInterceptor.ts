import {DBContext, MikroOrmRegistry, RetryStrategy} from "../services";
import {Inject, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {EntityManager} from "@mikro-orm/core";
import {Logger} from "@tsed/logger";

export interface TransactionOptions {
  retry?: boolean;
  contextName?: string;
  /**
   * @deprecated Since 2022-02-01. Use {@link contextName} instead
   */
  connectionName?: string;
}

@Interceptor()
export class TransactionalInterceptor implements InterceptorMethods {
  constructor(
    @Inject() private readonly registry: MikroOrmRegistry,
    @Inject() private readonly context: DBContext,
    @Inject() private readonly logger: Logger,
    @Inject(RetryStrategy)
    private readonly retryStrategy?: RetryStrategy
  ) {}

  public async intercept(context: InterceptorContext<unknown>, next: InterceptorNext): Promise<unknown> {
    const options = this.extractContextName(context);

    if (options.retry && !this.retryStrategy) {
      this.logger.warn(`To retry a transaction you have to implement a "${RetryStrategy.description}" interface`);
    }

    const ctx = this.context.entries();

    if (!ctx) {
      return this.runWithinNewCtx(next, options);
    }

    if (ctx.has(options.contextName!)) {
      return next();
    }

    return this.runUnderCtx(next, ctx, options);
  }

  private runWithinNewCtx(next: InterceptorNext, options: TransactionOptions): Promise<unknown> | unknown {
    const ctx = new Map<string, EntityManager>();

    return this.runUnderCtx(next, ctx, options);
  }

  private runUnderCtx(next: InterceptorNext, ctx: Map<string, EntityManager>, options: TransactionOptions): Promise<unknown> | unknown {
    const orm = this.registry.get(options.contextName);

    if (!orm) {
      throw new Error(
        `No such context: ${options.contextName}. Please register a corresponding MikroOrm instance using '@Configuration()' decorator.`
      );
    }

    const em = orm.em.fork(true, true);

    ctx.set(em.name, em);

    const runInTransaction = () => this.executeInTransaction(options.contextName!, next);

    return this.context.run(ctx, () => (options.retry ? this.retryStrategy?.acquire(runInTransaction) : runInTransaction()));
  }

  private extractContextName(context: InterceptorContext<unknown>): TransactionOptions {
    const options = context.options || ({} as Partial<TransactionOptions> | string);

    let contextName: string | undefined;
    let retry: boolean | undefined;

    if (typeof options === "string") {
      contextName = options;
    } else if (options) {
      contextName = options.contextName ?? options.connectionName;
      retry = options.retry;
    }

    if (!contextName) {
      contextName = "default";
    }

    if (!retry) {
      retry = false;
    }

    return {contextName, retry};
  }

  private async executeInTransaction(contextName: string, next: InterceptorNext): Promise<unknown> {
    const em = this.context.get(contextName);

    const result = await next();

    await em?.flush();

    return result;
  }
}
