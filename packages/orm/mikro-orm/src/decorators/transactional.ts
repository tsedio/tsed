import {TransactionalInterceptor, TransactionOptions} from "../interceptors";
import {Intercept} from "@tsed/di";

/**
 * Register a new request context for your method and execute it inside the context.
 * @param {String | TransactionOptions} contextNameOrOptions
 */
export const Transactional = (contextNameOrOptions?: string | TransactionOptions): MethodDecorator =>
  Intercept(TransactionalInterceptor, contextNameOrOptions);
