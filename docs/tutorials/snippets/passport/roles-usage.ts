import {Controller, Post} from "@tsed/common";
import {Authorize} from "@tsed/passport";
import {AcceptRoles} from "../decorators/acceptRoles";

@Controller("/calendars")
export class CalendarController {
  @Post("/")
  @Authorize("local")
  @AcceptRoles("admin")
  async post() {

  }
}
