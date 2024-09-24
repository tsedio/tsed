import {Controller} from "@tsed/di";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

interface Calendar {
  id: string;
  name: string;
}

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  async get(@PathParams("id") id: string): Promise<Calendar> {
    return {
      id,
      name: "test"
    };
  }
}
