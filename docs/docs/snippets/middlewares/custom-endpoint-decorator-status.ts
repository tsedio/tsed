import {applyDecorators, StoreSet} from "@tsed/core";
import {IResponseOptions, UseAfter, mapReturnedResponse} from "@tsed/common";

export function Status(code: number, options: IResponseOptions = {}) {
  const response = mapReturnedResponse(options);

  return applyDecorators(
    StoreSet("statusCode", code),
    StoreSet("response", response),
    StoreSet("responses", {[code]: response}),
    UseAfter((request: any, response: any, next: any) => {
      if (response.statusCode === 200) {
        response.status(code);
      }
      next();
    })
  );
}
