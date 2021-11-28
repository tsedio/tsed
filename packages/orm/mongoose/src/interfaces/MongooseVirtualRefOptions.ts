import {Type} from "@tsed/core";

export interface MongooseVirtualRefOptions {
  /**
   * @deprecated Since v6. Use ref instead.
   */
  type?: string | Type<any> | (() => Type<any>);
  ref?: string | Type<any> | (() => Type<any>);
  foreignField?: string;
  localField?: string;
  justOne?: boolean;
  count?: boolean;
  options?: object;
}
