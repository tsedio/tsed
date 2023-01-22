import {Controller, Get, PlatformTest, Post} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import SuperTest from "supertest";
import {Server} from "./app/Server";

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

describe("Swagger - nested controllers", () => {
  describe("OpenSpec3", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [DomainController, CommentController, FlaggedCommentController]
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
