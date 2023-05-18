import {PlatformMulterSettings} from "@tsed/common";
import type multer from "multer";
import {promisify} from "util";

let multerModule: typeof multer;

import("multer").then(({default: multer}) => (multerModule = multer));

export function multerMiddleware(options: PlatformMulterSettings) {
  const m = multerModule(options);

  const makePromise = (multer: any, name: string) => {
    // istanbul ignore next
    if (!multer[name]) return;

    const fn = multer[name];

    multer[name] = function apply(...args: any[]) {
      const middleware: any = Reflect.apply(fn, this, args);

      return (req: any, res: any) => promisify(middleware)(req, res);
    };
  };

  makePromise(m, "any");
  makePromise(m, "array");
  makePromise(m, "fields");
  makePromise(m, "none");
  makePromise(m, "single");

  return m;
}
