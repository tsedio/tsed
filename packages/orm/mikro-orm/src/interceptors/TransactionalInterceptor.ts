import {Inject, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {MikroOrmRegistry} from "../services/MikroOrmRegistry";
import {RetryStrategy} from "../services/RetryStrategy";
import {MikroOrmEntityManagers} from "../services/MikroOrmEntityManagers";
import {EntityManager} from "@mikro-orm/core";

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
    @Inject() private readonly managers: MikroOrmEntityManagers,
    @Inject() private readonly logger: Logger,
    @Inject(RetryStrategy)
    private readonly retryStrategy?: RetryStrategy
  ) {}

  public async intercept(context: InterceptorContext<unknown>, next: InterceptorNext): Promise<unknown> {
    const options = this.extractContextName(context);

    if (options.retry && !this.retryStrategy) {
      this.logger.warn(`To retry a transaction you have to implement a "${RetryStrategy.description}" interface`);
    }

    return this.runWithinCtx(next, options);
  }

  private runWithinCtx(next: InterceptorNext, options: TransactionOptions): Promise<unknown> | unknown {
    const orm = this.registry.get(options.contextName);

    if (!orm) {
      throw new Error(
        `No such context: ${options.contextName}. Please register a corresponding MikroOrm instance using '@Configuration()' decorator.`
      );
    }

    const {em} = orm;

    this.forkIfNoSuchEntityManager(em);

    return this.runInTransaction(next, options);
  }

  private forkIfNoSuchEntityManager(em: EntityManager): void {
    if (!this.managers.has(em.name)) {
      this.managers.set(em);
    }
  }

  private runInTransaction(next: InterceptorNext, options: TransactionOptions): Promise<unknown | undefined> {
    const callback = () => this.executeInTransaction(options.contextName!, next);

    return options.retry && this.retryStrategy ? this.retryStrategy.acquire(callback) : callback();
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
    const em = this.managers.get(contextName);

    const result = await next();

    await em?.flush();

    return result;
  }
}
