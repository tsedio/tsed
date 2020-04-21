import {Controller, Get} from "@tsed/common";
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

  @Get("/stream")
  buffer(): Buffer {
    return Buffer.from("Hello");
  }
}
