import type {Type} from "@tsed/core";

export interface InterceptorNext {
  <T>(err?: Error): T;
}

export interface InterceptorContext<Klass = Type, Opts = any> {
  target: Klass;
  propertyKey: string | symbol;
  args: any[];
  next: InterceptorNext;
  options?: Opts;
}
