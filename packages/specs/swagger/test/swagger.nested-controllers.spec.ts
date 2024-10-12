import {Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get, Post} from "@tsed/schema";
import SuperTest from "supertest";

import {Server} from "./app/Server.js";

@Controller("/")
export class FlaggedCommentController {
  @Get("/flag")
  async list() {}

  @Post("/:commentID/flag")
  async create() {}
}

@Controller({
  path: "/comments",
  children: [FlaggedCommentController]
})
export class CommentController {
  @Get("/")
  get() {}
}

@Controller({
  path: "/domain/:contextID",
  children: [CommentController]
})
export class DomainController {
  @Get("/")
  get() {}
}

@Controller({
  path: "/platform/:platform",
  children: [CommentController]
})
export class PlatformController {
  @Get("/")
  get() {}
}

describe("Swagger - nested controllers", () => {
  describe("OpenSpec3", () => {
    let request: SuperTest.Agent;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [DomainController, CommentController, FlaggedCommentController, PlatformController]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should swagger spec", async () => {
      const response = await request.get("/v3/doc/swagger.json").expect(200);

      expect(response.body).toMatchSnapshot();
    });
  });
});
