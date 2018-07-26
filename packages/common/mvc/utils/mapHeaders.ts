import {IResponseHeader} from "../interfaces/IResponseHeader";
import {IHeadersOptions, IResponseHeaders} from "../interfaces/IResponseHeaders";

export function mapHeaders(headers: IHeadersOptions): IResponseHeaders {
  return Object.keys(headers).reduce<IResponseHeaders>((newHeaders: IResponseHeaders, key: string, index: number, array: string[]) => {
    const value: any = headers[key];
    let type = typeof value;
    let options: IResponseHeader = {value};

    if (type === "object") {
      options = value;
      type = typeof options.value;
    }

    options.type = options.type || type;

    newHeaders[key] = options;

    return newHeaders;
  }, {});
}
