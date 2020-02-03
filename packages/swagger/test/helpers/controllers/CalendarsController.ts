import {Controller, Get} from "@tsed/common";
import {PathParams} from "@tsed/common/src/mvc/decorators/params/pathParams";
import {Returns, ReturnsArray} from "../../../src/decorators/returns";
import {Calendar} from "../models/Calendar";

@Controller("/calendars")
export class CalendarsController {
  @Get("/:id")
  @Returns(200, {type: Calendar})
  async get(@PathParams("id") id: string): Promise<Calendar> {
    return new Calendar({id, name: "test"});
  }

  @Get("/")
  @ReturnsArray(200, {type: Calendar})
  async getAll(): Promise<Calendar[]> {
    return [
      new Calendar({id: 1, name: "name"}),
      new Calendar({id: 2, name: "name"})
    ];
  }
}
