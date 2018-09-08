import {Controller, Get, PathParams} from "@tsed/common";
import {Docs, Hidden} from "../../../../../packages/swagger/src";

@Controller("/hidden")
@Hidden()
@Docs("hidden")
export class HiddenCtrl {
  @Get("/")
  async get(@PathParams("test") value: string, @PathParams("eventId") id: string) {
    return {value, id};
  }
}
