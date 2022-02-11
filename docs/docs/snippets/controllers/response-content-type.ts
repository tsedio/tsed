import {BodyParams} from "@tsed/platform-params";
import {ContentType, Returns} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  @ContentType(".html") // => 'text/html'
  @ContentType("html") // => 'text/html'
  @ContentType("json") // => 'application/json'
  @ContentType("application/json") // => 'application/json'
  @ContentType("png")
  getContent(@BodyParams("name") name: string): any {
    return "something";
  }

  @Returns(200, String).ContentType(".html") // => 'text/html'
  @Returns(200, String).ContentType("html") // => 'text/html'
  @Returns(200, Object).ContentType("json") // => 'application/json'
  @Returns(200, Object).ContentType("application/json") // => 'application/json'
  @Returns(200, String).ContentType("png")
  getContent2(@BodyParams("name") name: string): any {
    return "something";
  }
}
