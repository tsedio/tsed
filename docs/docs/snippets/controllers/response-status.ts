import {BodyParams} from "@tsed/platform-params";
import {Returns, Put} from "@tsed/schema";
import {Controller} from "@tsed/di";

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
