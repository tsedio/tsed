import {BodyParams, Controller, Header} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Header({
    "Content-Type": "text/plain",
    "Content-Length": 123,
    "ETag": {
      "value": "12345",
      "description": "header description"
    }
  })
  create(@BodyParams("name") name: string): string {
    return `Text plain ${name}`;
  }
}
