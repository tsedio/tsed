import {nameOf} from "@tsed/core";
import {Controller} from "@tsed/di";
import {Get, Post} from "@tsed/schema";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {application} from "../fn/application.js";
import {Platform} from "./Platform.js";

@Controller("/my-route")
class MyCtrl {
  @Get("/")
  get() {}
}

@Controller("/my-sub-route")
class MySubCtrl {
  @Get("/")
  get() {}
}

@Controller({
  path: "/my-route",
  children: [MySubCtrl]
})
class MyNestedCtrl {
  @Get("/")
  get() {}
}

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
  @Get("/all")
  get() {}
}

@Controller({
  path: "/domain/:contextID",
  children: [CommentController]
})
export class DomainController {
  @Get("/all")
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

describe("Platform", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("addRoute", () => {
    it("should add a route", async () => {
      // GIVEN
      const platform = await PlatformTest.get<Platform>(Platform);

      vi.spyOn(application(), "use");

      // WHEN
      platform.addRoutes([{route: "/test", token: MyCtrl}]);
    });
    it("should add nested controllers (1)", async () => {
      // GIVEN
      const platform = await PlatformTest.get<Platform>(Platform);

      vi.spyOn(application(), "use");

      // WHEN
      platform.addRoutes([{route: "/rest", token: MyNestedCtrl}]);
      platform.addRoutes([{route: "/rest", token: MySubCtrl}]);

      platform.getLayers();
      const result = platform.getMountedControllers();

      // THEN
      expect(result.length).toEqual(2);
      expect(result[0].route).toEqual("/rest");
      expect(result[1].route).toEqual("/rest/my-route");
    });
    it("should add nested controllers (2)", async () => {
      // GIVEN
      const platform = await PlatformTest.get<Platform>(Platform);

      vi.spyOn(application(), "use");

      // WHEN
      platform.addRoutes([{route: "/rest", token: DomainController}]);
      platform.addRoutes([{route: "/rest", token: PlatformController}]);

      platform.getLayers();

      const result = platform.getMountedControllers();

      // THEN
      const data = result.map((c) => ({route: c.route, name: nameOf(c.provider)}));
      expect(data).toEqual([
        {
          name: "Token:DomainController:DomainController",
          route: "/rest"
        },
        {
          name: "Token:CommentController:CommentController",
          route: "/rest/domain/:contextID"
        },
        {
          name: "Token:FlaggedCommentController:FlaggedCommentController",
          route: "/rest/domain/:contextID/comments"
        },
        {
          name: "Token:PlatformController:PlatformController",
          route: "/rest"
        },
        {
          name: "Token:CommentController:CommentController",
          route: "/rest/platform/:platform"
        },
        {
          name: "Token:FlaggedCommentController:FlaggedCommentController",
          route: "/rest/platform/:platform/comments"
        }
      ]);
    });
  });
});
