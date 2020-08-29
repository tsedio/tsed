import {Context} from "../../platform/decorators/context";
import {Catch} from "../decorators/catch";
import {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods";

const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

@Catch(String)
export class StringErrorFilter implements ExceptionFilterMethods {
  catch(error: string, ctx: Context): void {
    ctx.response.status(404).body(toHTML(error));
  }
}
