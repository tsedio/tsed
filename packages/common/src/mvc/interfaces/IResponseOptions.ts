import {IMetadataType} from "@tsed/core";
import {IResponseHeaders} from "./IResponseHeaders";

declare global {
  namespace TsED {
    interface ResponseOptions {}
  }
}

export interface IResponseOptions extends IMetadataType, TsED.ResponseOptions {
  code?: number;
  headers?: {
    [exampleName: string]: IResponseHeaders;
  };

  [key: string]: any;
}
