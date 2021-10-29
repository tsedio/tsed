import {PlatformContext, ResourceNotFound} from "@tsed/common";
import {Catch, ExceptionFilterMethods} from "@tsed/platform-exceptions";

@Catch(ResourceNotFound)
export class ResourceNotFoundFilter implements ExceptionFilterMethods {
  async catch(exception: ResourceNotFound, ctx: PlatformContext) {
    const {response} = ctx;

    const obj = {
      status: exception.status,
      message: exception.message,
      url: exception.url
    };
    // Json response
    response.status(exception.status).body(obj);

    // Or with ejs/handlers/etc...
    const html = await response.render("404.ejs", obj);
    response.status(exception.status).body(html);
  }
}
