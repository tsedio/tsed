import {BodyParams, Post} from "@tsed/common";

class MyController {
  @Post()
  async create(@BodyParams({expression: "user", useConverter: false}) body: T): Promise<T> {
    console.log("payload", body);

    return body;
  }
}
