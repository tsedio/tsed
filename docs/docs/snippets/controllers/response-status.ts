import {BodyParams, Controller, Put, Status} from "@tsed/common";

interface Calendar {
  id: string;
  name: string;
}

@Controller("/calendars")
export class CalendarCtrl {
  @Put("/")
  @Status(201)
  create(@BodyParams("name") id: string): Calendar {
    return {id: "2", name: "test"};
  }
}
