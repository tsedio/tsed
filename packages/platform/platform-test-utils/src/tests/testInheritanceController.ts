import {BodyParams, Controller, Get, PathParams, PlatformTest, Post} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Description, MaxLength, MinLength, Property, Returns, Summary} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

export class Resource {
  @Property()
  id: string;

  @Property()
  @MinLength(3)
  @MaxLength(100)
  name: string;
}

export class BaseController<T extends {id: string}> {
  resources: T[];

  @Get("/:id")
  @Summary("Return an element by his resource")
  async get(
    @Description("Id of the resource")
    @PathParams("id")
    id: string
  ): Promise<any> {
    const resource = this.resources.find((resource) => resource.id === id);

    if (!resource) {
      throw new NotFound("Not found");
    }

    return resource;
  }

  @Get("/")
  @Summary("Return all elements from a service")
  async list(): Promise<any[]> {
    return this.resources;
  }
}

@Controller("/resources")
export class ResourcesCtrl extends BaseController<Resource> {
  resources = [{id: "1", name: "John"}];

  @Get("/:id")
  @Summary("Return an element by his resource")
  async get(
    @Description("Id of the resource")
    @PathParams("id")
    id: string
  ): Promise<any> {
    const resource = await super.get(id);

    resource.name = resource.name + " hello You!";

    return resource;
  }

  @Post("/")
  @(Returns(201).Type(Resource))
  async post(@BodyParams() resource: Resource) {
    resource.id = require("uuid").v4();
    this.resources.push(resource);

    return resource;
  }
}

export function testInheritanceController(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [ResourcesCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("should return list", async () => {
    const {body} = await request.get("/rest/resources").expect(200);

    expect(body).to.deep.eq([{id: "1", name: "John"}]);
  });

  it("should return a resource", async () => {
    const {body} = await request.get("/rest/resources/1").expect(200);

    expect(body).to.deep.eq({
      id: "1",
      name: "John hello You!"
    });
  });

  it("should add a resource", async () => {
    const {body} = await request
      .post("/rest/resources")
      .send({
        name: "july"
      })
      .expect(201);

    expect(body.name).to.deep.eq("july");
    expect(body.id).to.be.a("string");

    const {body: resource} = await request.get(`/rest/resources/${body.id}`).expect(200);

    expect(resource.id).to.deep.eq(body.id);
  });
}
