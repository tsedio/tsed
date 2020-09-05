import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {creatFakePlatformRequest} from "../../../../test/helper/createFakePlatformRequest";
import {indexMiddleware} from "./indexMiddleware";

const sandbox = Sinon.createSandbox();
describe("indexMiddleware and redirect", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should create a middleware", async () => {
    const ctx = creatFakePlatformRequest(sandbox);
    sandbox.stub(ctx.response, "render");

    const viewPath = "/swagger.ejs";
    const conf = {
      path: "/doc",
      options: {},
      showExplorer: false,
      cssPath: "/path.css",
      jsPath: "/path.js",
      urls: []
    };

    await indexMiddleware(viewPath, conf)(ctx);

    expect(ctx.response.render).to.have.been.calledWithExactly(viewPath, {
      spec: {},
      cssPath: "/path.css",
      jsPath: "/path.js",
      showExplorer: false,
      swaggerOptions: {},
      url: "/doc/swagger.json",
      urls: []
    });
  });
});
