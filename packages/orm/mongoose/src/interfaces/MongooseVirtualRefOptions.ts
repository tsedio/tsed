import type {Type} from "@tsed/core";

export interface MongooseVirtualRefOptions {
  ref?: string | Type<any> | (() => Type<any>);
  foreignField?: string;
  localField?: string;
  justOne?: boolean;
  count?: boolean;
  options?: object;
}
