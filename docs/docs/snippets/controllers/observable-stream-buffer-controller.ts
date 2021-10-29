import {PlatformResponse, Res} from "@tsed/common";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {createReadStream, ReadStream} from "fs";
import {Observable, of} from "rxjs";

@Controller("/")
export class KindOfResponseCtrl {
  @Get("/observable")
  observable(): Observable<any[]> {
    return of([]);
  }

  @Get("/stream")
  stream(): ReadStream {
    return createReadStream(__dirname + "/response.txt");
  }

  @Get("/buffer")
  buffer(@Res() res: PlatformResponse): Buffer {
    // Set attachment: res.attachment("filename")
    // Set contentType: res.contentType("plain/text");

    return Buffer.from("Hello");
  }
}
