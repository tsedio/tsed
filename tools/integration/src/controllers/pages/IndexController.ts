import {Constant, Controller} from "@tsed/di";
import {Get, Hidden, Returns} from "@tsed/schema";
import {HeaderParams} from "@tsed/platform-params";
import {SwaggerSettings} from "@tsed/swagger";
import {View} from "@tsed/platform-views";

@Hidden()
@Controller("/")
export class IndexController {
  @Constant("swagger")
  private swagger: SwaggerSettings[];

  @Get("/")
  @View("swagger.ejs")
  @(Returns(200, String).ContentType("text/html"))
  get(@HeaderParams("x-forwarded-proto") protocol: string, @HeaderParams("host") host: string) {
    const hostUrl = `${protocol || "http"}://${host}`;

    return {
      BASE_URL: hostUrl,
      docs: this.swagger.map((conf) => {
        return {
          url: hostUrl + conf.path,
          ...conf
        };
      })
    };
  }
}
