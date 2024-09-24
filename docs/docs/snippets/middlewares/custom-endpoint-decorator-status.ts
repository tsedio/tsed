import {useDecorators} from "@tsed/core";
import {UseAfter} from "@tsed/platform-middlewares";

export function CustomStatus(code: number) {
  return useDecorators(
    UseAfter((req: any, res: any, next: any) => {
      res.status(code);
      next();
    })
  );
}
