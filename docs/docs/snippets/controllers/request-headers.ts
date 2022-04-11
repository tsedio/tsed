import {HeaderParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  @Get()
  get(@HeaderParams("x-token") token: string): string {
    console.log("token", token);

    return token;
  }
}
