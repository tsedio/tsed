import {Type} from "@tsed/core";
import {IResponseHeaders} from "./IResponseHeaders";

export interface IResponseOptions {
  /**
   * Use IResponseOptions.type instead of
   * @deprecated
   */
  use?: Type<any>;
  type?: Type<any>;
  /**
   * Use IResponseOptions.collectionType instead of
   * @deprecated
   */
  collection?: Type<any>;
  collectionType?: Type<any>;
  description?: string;
  examples?: {[exampleName: string]: string};
  headers?: IResponseHeaders;
}
