import {Intercept} from "@tsed/di";

import type {TransactionOptions} from "../interceptors/TransactionalInterceptor.js";
import {TransactionalInterceptor} from "../interceptors/TransactionalInterceptor.js";

/**
 * Register a new request context for your method and execute it inside the context.
 * @param {String | TransactionOptions} contextNameOrOptions
 */
export const Transactional = (contextNameOrOptions?: string | TransactionOptions): MethodDecorator =>
  Intercept(TransactionalInterceptor, contextNameOrOptions);
