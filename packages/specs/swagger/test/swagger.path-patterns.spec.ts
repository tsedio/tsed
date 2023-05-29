import {BodyParams, Controller, Get, PathParams, PlatformTest, Post} from "@tsed/common";
import {ObjectID} from "@tsed/mongoose";
import {PlatformExpress} from "@tsed/platform-express";
import {Consumes, Returns} from "@tsed/schema";
import SuperTest from "supertest";
import {Calendar} from "./app/models/Calendar";
import {Server} from "./app/Server";

@Controller("/admin")
class AdminCtrl {
  @Get("/all")
  get() {}

  @Post("/:id")
  post() {}
}

@Controller({
  path: "/calendars"
})
class CalendarsController {
  @Get("/:id")
  @Returns(200, Calendar)
  get(@PathParams("id") @ObjectID() id: string): Promise<Calendar> {
    return Promise.resolve(new Calendar({id, name: "test"}));
  }

  @Get("/")
  @Returns(200, Array).Of(Calendar)
  getAll(): Promise<Calendar[]> {
    return Promise.resolve([new Calendar({id: 1, name: "name"}), new Calendar({id: 2, name: "name"})]);
  }

  @Post("/csv")
  @Consumes("text/plain")
  @Returns(200, String).ContentType("text/plain")
  csv(@BodyParams() csvLines: string): Promise<string> {
    return Promise.resolve("");
  }
}

describe("Swagger integration: pathPatterns", () => {
  describe("OpenSpec3", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        platform: PlatformExpress,
        swagger: [
          {
            path: "/rest/doc",
            pathPatterns: [`/rest/orgs/**/*`],
            specVersion: "3.0.1"
          },
          {
            path: "/rest/doc/admin",
            pathPatterns: [`/rest/**/*`],
            specVersion: "3.0.1"
          }
        ],
        mount: {
          "/rest/orgs": [CalendarsController],
          "/rest": [AdminCtrl]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should swagger spec (orgs)", async () => {
      const response = await request.get("/rest/doc/swagger.json").expect(200);

      expect(response.body).toMatchSnapshot();
    });

    it("should swagger spec (admin)", async () => {
      const response = await request.get("/rest/doc/admin/swagger.json").expect(200);

      expect(response.body).toMatchSnapshot();
    });
  });
});
