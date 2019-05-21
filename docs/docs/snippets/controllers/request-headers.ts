import {Controller, Get, HeaderParams} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {

  @Get()
  get(@HeaderParams("x-token") token: string): string {
    console.log("token", token);

    return token;
  }
}
