import {PlatformMulterSettings} from "../../config/interfaces/PlatformMulterSettings";
import {promisify} from "util";

export function getMulter(options: PlatformMulterSettings) {
  const m = require("multer")(options);

  const makePromise = (multer: any, name: string) => {
    // istanbul ignore next
    if (!multer[name]) return;

    const fn = multer[name];

    multer[name] = function apply(...args: any[]) {
      const middleware = Reflect.apply(fn, this, args);

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
