import {Catch, ExceptionFilterMethods, PlatformContext, ResourceNotFound} from "@tsed/common";

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
    response
      .status(exception.status)
      .body(obj);

    // Or with ejs/handlers/etc...
    await response
      .status(exception.status)
      .render("404.ejs", obj);
  }
}
