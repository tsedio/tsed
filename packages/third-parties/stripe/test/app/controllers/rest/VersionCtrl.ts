import {Get, Returns, object, string} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/version")
export class VersionCtrl {
  @Get("/")
  @(Returns(200)
    .ContentType("application/json")
    .Schema(object().properties({name: string(), version: string()})))
  async get() {
    const {name, version} = (await import("../../../../package.json", {with: {type: "json"}})) as any;

    return {
      name,
      version
    };
  }
}
