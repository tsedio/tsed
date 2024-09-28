import {BaseContext} from "@tsed/di";

import {Catch} from "../decorators/catch.js";
import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods.js";

const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

@Catch(String)
export class StringErrorFilter implements ExceptionFilterMethods {
  catch(error: string, ctx: BaseContext): void {
    ctx.response.status(404).body(toHTML(error));
  }
}
