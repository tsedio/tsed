import {BodyParams} from "@tsed/platform-params";
import {Header, Returns} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  @Header({
    "Content-Type": "text/plain",
    "Content-Length": 123,
    ETag: {
      value: "12345",
      description: "header description"
    }
  })
  create(@BodyParams("name") name: string): string {
    return `Text plain ${name}`;
  }

  @Returns().Headers({
    "Content-Type": "text/plain",
    "Content-Length": 123,
    ETag: {
      value: "12345",
      description: "header description"
    }
  })
  create2(@BodyParams("name") name: string): string {
    return `Text plain ${name}`;
  }
}
