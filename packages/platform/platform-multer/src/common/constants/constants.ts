import type {Multer, Options} from "multer";

export interface MULTER_MODULE {
  multer: Multer;

  get(options: Options): any;
}

export const MULTER_MODULE = Symbol.for("MULTER_MODULE");
export const PLATFORM_MULTER_OPTIONS = Symbol.for("PLATFORM_MULTER_OPTIONS");
