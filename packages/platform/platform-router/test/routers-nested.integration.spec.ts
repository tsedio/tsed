import {PlatformTest} from "@tsed/common";
import {Controller, InjectorService} from "@tsed/di";
import {PlatformParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {PlatformRouter} from "../src/domain/PlatformRouter";
import {PlatformRouters} from "../src/domain/PlatformRouters";

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

function createAppRouterFixture() {
  const injector = new InjectorService();
  const platformRouters = injector.invoke<PlatformRouters>(PlatformRouters);
  const platformParams = injector.invoke<PlatformParams>(PlatformParams);
  const appRouter = injector.invoke<PlatformRouter>(PlatformRouter);

  injector.addProvider(FlaggedCommentController, {});
  injector.addProvider(CommentController, {});
  injector.addProvider(DomainController, {});
  injector.addProvider(PlatformController, {});

  return {injector, appRouter, platformRouters, platformParams};
}

describe("routers integration", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("getLayers()", () => {
    it("should declare router", () => {
      const {platformRouters, appRouter} = createAppRouterFixture();

      platformRouters.prebuild();

      appRouter.use("/rest", platformRouters.from(DomainController));
      appRouter.use("/rest", platformRouters.from(PlatformController));

      const layers = platformRouters.getLayers(appRouter);

      expect(
        layers.map((layer) => {
          return layer.inspect().path;
        })
      ).toEqual([
        "/rest/domain/:contextID",
        "/rest/domain/:contextID/comments",
        "/rest/domain/:contextID/comments/flag",
        "/rest/domain/:contextID/comments/:commentID/flag",
        "/rest/platform/:platform",
        "/rest/platform/:platform/comments",
        "/rest/platform/:platform/comments/flag",
        "/rest/platform/:platform/comments/:commentID/flag"
      ]);

      expect(
        layers.map((layer) => {
          return layer.getBasePath();
        })
      ).toEqual([
        "/rest",
        "/rest/domain/:contextID",
        "/rest/domain/:contextID/comments",
        "/rest/domain/:contextID/comments",
        "/rest",
        "/rest/platform/:platform",
        "/rest/platform/:platform/comments",
        "/rest/platform/:platform/comments"
      ]);
    });
  });
});
