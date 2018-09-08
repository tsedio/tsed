import {Type} from "@tsed/core";
import {Header} from "swagger-schema-official";

export interface ISwaggerResponses {
  /**
   * Use IResponseOptions.type instead of
   * @deprecated
   */
  use?: Type<any>;
  type?: Type<any>;
  collection?: Type<any>;
  description?: string;
  examples?: {[exampleName: string]: string};
  headers?: {[headerName: string]: Header};
}
