import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {Put, Returns} from "@tsed/schema";

interface Calendar {
  id: string;
  name: string;
}

@Controller("/calendars")
export class CalendarCtrl {
  @Put("/")
  @Returns(201)
  create(@BodyParams("name") id: string): Calendar {
    return {id: "2", name: "test"};
  }
}
