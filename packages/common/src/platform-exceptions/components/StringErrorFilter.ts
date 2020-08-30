import type {Context} from "../../platform/decorators/context";
import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods";
import {Catch} from "../decorators/catch";

const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

@Catch(String)
export class StringErrorFilter implements ExceptionFilterMethods {
  catch(error: string, ctx: Context): void {
    ctx.response.status(404).body(toHTML(error));
  }
}
