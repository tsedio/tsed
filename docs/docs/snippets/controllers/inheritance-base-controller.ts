import {Get, QueryParams} from "@tsed/common";
import {SomeService} from "./SomeService";

export abstract class BaseCtrl {
  constructor(private someService: SomeService) {
  }

  @Get("/list")
  async list(@QueryParams("search") search: any) {
    return this.someService.list(search);
  }
}
