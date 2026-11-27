import {createReadStream, ReadStream} from "node:fs";
import {PlatformResponse, Res} from "@tsed/platform-http";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {Observable, of} from "rxjs";

// FIXME remove when esm is ready

@Controller("/")
export class KindOfResponseCtrl {
  @Get("/observable")
  observable(): Observable<any[]> {
    return of([]);
  }

  @Get("/stream")
  stream(): ReadStream {
    return createReadStream(import.meta.dirname + "/response.txt");
  }

  @Get("/buffer")
  buffer(@Res() res: PlatformResponse): Buffer {
    // Set attachment: res.attachment("filename")
    // Set contentType: res.contentType("text/plain");

    return Buffer.from("Hello");
  }
}
