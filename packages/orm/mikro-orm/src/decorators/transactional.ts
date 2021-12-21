import {TransactionalInterceptor, TransactionOptions} from "../interceptors";
import {Intercept} from "@tsed/di";

export const Transactional = (connectionOrOptions?: string | TransactionOptions): MethodDecorator =>
  Intercept(TransactionalInterceptor, connectionOrOptions);
