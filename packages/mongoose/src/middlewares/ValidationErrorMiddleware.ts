import {Err, Middleware} from "@tsed/common";
import {getClass, nameOf} from "@tsed/core";
import {BadRequest} from "ts-httpexceptions";

/**
 * @middleware
 */
@Middleware()
export class ValidationErrorMiddleware {
  use(@Err() error: any) {
    if (error && nameOf(getClass(error)) === "MongooseError") {
      const err = new BadRequest(error.message);
      err.stack = error.stack;
      throw err;
    }

    throw error;
  }
}
