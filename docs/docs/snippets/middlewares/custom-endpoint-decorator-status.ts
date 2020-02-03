import {UseAfter} from "@tsed/common";
import {applyDecorators} from "@tsed/core";

export function CustomStatus(code: number) {
  return applyDecorators(
    UseAfter((req: any, res: any, next: any) => {
      res.status(code);
      next();
    })
  );
}
