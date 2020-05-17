import {MetadataTypes} from "@tsed/core";

declare global {
  namespace TsED {
    interface ResponseHeader {
      value?: string | number;
    }

    interface ResponseHeaders {
      [key: string]: ResponseHeader;
    }

    interface ResponseOptions extends Partial<MetadataTypes> {
      code?: number;
      headers?: {
        [key: string]: ResponseHeader;
      };
    }
  }
}

export interface IResponseOptions extends TsED.ResponseOptions {}

export interface IResponseHeaders extends TsED.ResponseHeaders {}

export interface IResponseHeader extends TsED.ResponseHeader {}
