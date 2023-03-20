import {PlatformTest} from "@tsed/common";
import {requires} from "@tsed/engines";
import {PlatformViews} from "./PlatformViews";

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

      jest.spyOn(engine, "render").mockResolvedValue("HTML");

      const result = await platformViews.render("views.ejs");

      expect(result).toEqual("HTML");
      expect(engine.render).toBeCalledWith("views.ejs", {
        cache: false,
        global: "global",
        requires: "requires"
      });
    });
    it("should render a template without extension", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);
      const engine = platformViews.getEngine("ejs")!;

      jest.spyOn(engine, "render").mockResolvedValue("HTML");

      const result = await platformViews.render("views", {test: "test"});

      expect(result).toEqual("HTML");
      expect(engine.render).toBeCalledWith("views.ejs", {
        cache: false,
        global: "global",
        test: "test",
        requires: "requires"
      });
    });
    it("should render a template without extension", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);
      const engine = platformViews.getEngine("ejs")!;

      jest.spyOn(engine, "render").mockResolvedValue("HTML");

      let error: any;

      try {
        await platformViews.render("views.toto", {test: "test"});
      } catch (er) {
        error = er;
      }

      expect(error.message).toEqual('Engine not found to render the following "views.toto"');
    });
  });
});
