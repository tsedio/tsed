import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, QueryParams} from "@tsed/common";
import {Data} from "../models/Data";

@Controller("ctrl")
export class TestCtrl {
  @Get("/:id")
  async get(@PathParams("id") id: number): Promise<Data> {
    return {
      id,
      name: `${id} name`
    };
  }

  @Post("/:id")
  async post(@PathParams("id") id: number, @BodyParams("name") name: string): Promise<Data> {
    return {
      id,
      name
    };
  }

  @Put("/:id")
  async put(@PathParams("id") id: number, @QueryParams("name") name: string): Promise<Data> {
    return {
      id,
      name
    };
  }

  @Delete("/:id")
  async delete(@PathParams("id") id: number): Promise<Data> {
    return {
      id,
      name: `${id} name`
    };
  }
}
