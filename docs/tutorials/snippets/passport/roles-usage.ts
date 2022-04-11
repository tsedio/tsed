import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Authorize} from "@tsed/passport";
import {AcceptRoles} from "../decorators/acceptRoles";

@Controller("/calendars")
export class CalendarController {
  @Post("/")
  @Authorize("local")
  @AcceptRoles("admin")
  async post() {}
}
