import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {PlatformViews} from "./PlatformViews";

const sandbox = Sinon.createSandbox();

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
            global: "global"
          }
        }
      }
    })
  );
  afterEach(() => PlatformTest.reset());
  afterEach(() => sandbox.restore());
  describe("render()", () => {
    it("should render a template with given extension", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);

      sandbox.stub(platformViews.consolidate, "ejs").resolves("HTML");

      const result = await platformViews.render("views.ejs");

      expect(result).to.equal("HTML");
      expect(platformViews.consolidate.ejs).to.have.been.calledWithExactly("views.ejs", {global: "global"});
    });
    it("should render a template without extension", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);

      sandbox.stub(platformViews.consolidate, "ejs").resolves("HTML");

      const result = await platformViews.render("views", {test: "test"});

      expect(result).to.equal("HTML");
      expect(platformViews.consolidate.ejs).to.have.been.calledWithExactly("views.ejs", {
        global: "global",
        test: "test"
      });
    });
    it("should render a template without extension", async () => {
      const platformViews = PlatformTest.get<PlatformViews>(PlatformViews);

      sandbox.stub(platformViews.consolidate, "ejs").resolves("HTML");

      let error: any;
      try {
        await platformViews.render("views.toto", {test: "test"});
      } catch (er) {
        error = er;
      }

      expect(error.message).to.equal("Engine not found for the \".toto\" file extension");
    });
  });
});
