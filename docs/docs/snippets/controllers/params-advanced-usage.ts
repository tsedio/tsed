import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";

class MyController {
  @Post()
  async create(@BodyParams({expression: "user", useMapper: false}) body: T): Promise<T> {
    console.log("payload", body);

    return body;
  }
}
