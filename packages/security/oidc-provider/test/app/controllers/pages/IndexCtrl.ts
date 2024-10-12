import "@tsed/platform-views";

import {Constant, Controller, HeaderParams} from "@tsed/platform-http";
import {Get, Returns, View} from "@tsed/schema";
import {Hidden, SwaggerSettings} from "@tsed/swagger";

@Hidden()
@Controller("/")
export class IndexCtrl {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  @Get("/")
  @View("index.ejs")
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
