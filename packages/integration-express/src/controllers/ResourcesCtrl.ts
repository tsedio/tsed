import {Controller, Delete, Get, Post, Put, Required, ReturnType, Status} from "@tsed/common";
import {BodyParams} from "@tsed/common/src/mvc/decorators/params/bodyParams";
import {PathParams} from "@tsed/common/src/mvc/decorators/params/pathParams";
import {NotFound} from "ts-httpexceptions";
import {Resource} from "../domains/Resource";

@Controller("/resources")
export class ResourcesCtrl {
  protected resources: Resource[] = [{id: "1", name: "Test"}];

  @Get("/:id")
  @ReturnType({type: Resource})
  async get(@PathParams("id") @Required() id: string): Promise<Resource> {
    const resource = this.resources.find(resource => resource.id === id);

    if (!resource) {
      throw new NotFound("Not found");
    }

    return resource;
  }

  @Post("/")
  @Status(201)
  @ReturnType({type: Resource})
  async post(@BodyParams() resource: Resource) {
    resource.id = require("uuid/v4")();
    this.resources.push(resource);

    return resource;
  }

  @Put("/:id")
  @ReturnType({type: Resource})
  async put(@PathParams("id") @Required() id: string, @BodyParams() resource: Resource) {
    await this.get(id);

    this.resources = this.resources.map(item => (item.id === resource.id ? resource : item));

    return resource;
  }

  @Delete("/:id")
  @Status(204)
  async delete(@PathParams("id") @Required() id: string): Promise<void> {
    this.resources = this.resources.filter(resource => resource.id === id);
  }

  @Get("/")
  @ReturnType({type: Resource, collectionType: Array})
  async getAll(): Promise<Resource[]> {
    return this.resources;
  }
}
