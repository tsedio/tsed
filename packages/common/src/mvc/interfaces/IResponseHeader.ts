declare global {
  namespace TsED {
    interface ResponseHeader {}
  }
}

export interface IResponseHeader extends TsED.ResponseHeader {
  value: string | number;

  [key: string]: any;
}
