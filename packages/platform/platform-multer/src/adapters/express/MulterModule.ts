import {MULTER_MODULE} from "../../common/index.js";
import type {Options} from "multer";
import {injectable} from "@tsed/di";
import {promisify} from "node:util";

async function factory() {
  const {default: multer} = await import("multer");

  return {
    multer,
    get(options: Options) {
      const instance = multer(options);

      const makePromise = (multer: any, name: string) => {
        // istanbul ignore next
        if (!multer[name]) return;

        const fn = multer[name];

        multer[name] = function apply(...args: any[]) {
          const middleware: any = Reflect.apply(fn, this, args);

          return (req: any, res: any) => promisify(middleware)(req, res);
        };
      };

      makePromise(instance, "any");
      makePromise(instance, "array");
      makePromise(instance, "fields");
      makePromise(instance, "none");
      makePromise(instance, "single");

      return instance;
    }
  };
}

injectable(MULTER_MODULE).asyncFactory(factory).token();
