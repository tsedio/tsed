import {BodyParams, Post} from "@tsed/common";
import {Type} from "@tsed/core";

abstract class BaseCRUDCtrl<T> {
  protected abstract $model: Type<T>;

  @Post()
  async create(@BodyParams({expression: "user", useConverter: false}) body: T): Promise<T> {
    console.log("payload", body);

    return body;
  }
}
