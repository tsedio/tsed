import {Controller} from "@tsed/di";
import {Get, object, Returns, string} from "@tsed/schema";

@Controller("/version")
export class VersionCtrl {
  @Get("/")
  @(Returns(200)
    .ContentType("application/json")
    .Schema(object().properties({name: string(), version: string()})))
  async get() {
    const {name, version} = await import("../../../../package.json");
    return {
      name,
      version
    };
  }
}
