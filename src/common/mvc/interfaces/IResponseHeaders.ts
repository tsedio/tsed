import {IResponseHeader} from "./IResponseHeader";

export interface IResponseHeaders {
  [key: string]: IResponseHeader;
}

export interface IHeadersOptions {
  [key: string]: number | string | IResponseHeader;
}
