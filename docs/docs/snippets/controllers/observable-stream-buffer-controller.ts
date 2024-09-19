import {PlatformResponse, Res} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {createReadStream, ReadStream} from "fs";
import {Observable, of} from "rxjs";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

@Controller("/")
export class KindOfResponseCtrl {
  @Get("/observable")
  observable(): Observable<any[]> {
    return of([]);
  }

  @Get("/stream")
  stream(): ReadStream {
    return createReadStream(rootDir + "/response.txt");
  }

  @Get("/buffer")
  buffer(@Res() res: PlatformResponse): Buffer {
    // Set attachment: res.attachment("filename")
    // Set contentType: res.contentType("plain/text");

    return Buffer.from("Hello");
  }
}
