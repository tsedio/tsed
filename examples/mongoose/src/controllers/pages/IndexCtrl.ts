import { Constant, Controller, Get, HeaderParams, View } from "@tsed/common";
import { Hidden, SwaggerSettings } from "@tsed/swagger";
import { Returns } from "@tsed/schema";

@Hidden()
@Controller("/")
export class IndexCtrl {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  @Get("/")
  @View("index.ejs")
  get(
    @HeaderParams("x-forwarded-proto") protocol: string,
    @HeaderParams("host") host: string
  ) {
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
