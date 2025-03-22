import {BadRequest} from "@tsed/exceptions";
import type {MulterError} from "multer";

/**
 * Exception thrown when a Multer error occurs during file upload operations.
 * Extends the BadRequest exception with Multer-specific properties.
 */
export class MulterException extends BadRequest {
  origin: MulterError;

  /**
   * Creates a new MulterException
   * @param er - The original Multer error
   */
  constructor(er: MulterError) {
    super(er.message);
    this.origin = er;
    this.name = er.code;
  }
}
