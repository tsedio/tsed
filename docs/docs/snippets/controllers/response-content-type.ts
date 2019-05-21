import {BodyParams, ContentType, Controller} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @ContentType(".html")              // => 'text/html'
  @ContentType("html")               // => 'text/html'
  @ContentType("json")               // => 'application/json'
  @ContentType("application/json")   // => 'application/json'
  @ContentType("png")
  getContent(@BodyParams("name") name: string): any {
    return "something";
  }
}
