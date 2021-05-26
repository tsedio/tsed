import {UseAfter} from "@tsed/common";
import {useDecorators} from "@tsed/core";

export function CustomStatus(code: number) {
  return useDecorators(
    UseAfter((req: any, res: any, next: any) => {
      res.status(code);
      next();
    })
  );
}
