import {Post} from "@tsed/schema";
import {BodyParams} from "@tsed/platform-params";

class MyController {
  @Post()
  async create(@BodyParams({expression: "user", useMapper: false}) body: T): Promise<T> {
    console.log("payload", body);

    return body;
  }
}
