import {BadRequest} from "@tsed/exceptions";
import type {MulterError} from "multer";

export class MulterException extends BadRequest {
  constructor(er: MulterError) {
    super(er.message);
    this.origin = er;
    this.name = er.code;
  }
}
