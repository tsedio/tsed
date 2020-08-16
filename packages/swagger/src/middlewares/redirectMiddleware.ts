import {Next, Req, Res} from "@tsed/common";

export function redirectMiddleware(path: string) {
  return (req: Req, res: Res, next: Next) => {
    if (req.url === path && !req.url.match(/\/$/)) {
      res.redirect(`${path}/`);
    } else {
      next();
    }
  };
}
