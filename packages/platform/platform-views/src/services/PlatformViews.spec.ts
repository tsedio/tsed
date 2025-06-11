import {Injectable} from "@tsed/di";
import {requires} from "@tsed/engines";
import {PlatformTest} from "@tsed/platform-http/testing";

import {PlatformViews} from "./PlatformViews.js";

@Injectable()
class AlterOptions {
  $alterRenderOptions(options: any, $ctx: any) {
    options.alter = "alter";

    expect($ctx).toBeTypeOf("object");

    return Promise.resolve(options);
  }
}

describe("PlatformViews", () => {
  beforeEach(() =>
    PlatformTest.create({
      views: {
        extensions: {
          ejs: "ejs"
        },
        viewEngine: "ejs",
        options: {
          ejs: {
            global: "global",
            requires: "requires"
          }
        }
      }
    })
  );
  afterEach(() => {
    requires.delete("ejs");
  });
  afterEach(() => PlatformTest.reset());

  describe("render()", () => {
    it("should render a template with given extension", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);
      const engine = platformViews.getEngine("ejs")!;

      vi.spyOn(engine, "render").mockResolvedValue("HTML");

      const result = await platformViews.render("views.ejs", {$ctx: {}});

      expect(result).toEqual("HTML");
      expect(engine.render).toHaveBeenCalledWith("views.ejs", {
        cache: false,
        alter: "alter",
        global: "global",
        requires: "requires",
        $ctx: {}
      });
    });
    it("should render a template without extension", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);
      const engine = platformViews.getEngine("ejs")!;

      vi.spyOn(engine, "render").mockResolvedValue("HTML");

      const result = await platformViews.render("views", {test: "test", $ctx: {}});

      expect(result).toEqual("HTML");
      expect(engine.render).toHaveBeenCalledWith("views.ejs", {
        cache: false,
        global: "global",
        test: "test",
        alter: "alter",
        requires: "requires",
        $ctx: {}
      });
    });
    it("should render a template without extension and catch error", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);
      const engine = platformViews.getEngine("ejs")!;

      vi.spyOn(engine, "render").mockResolvedValue("HTML");

      let error: any;

      try {
        await platformViews.render("views.toto", {test: "test", $ctx: {}});
      } catch (er) {
        error = er;
      }

      expect(error.message).toEqual('Engine not found to render the following "views.toto"');
    });
  });
});
