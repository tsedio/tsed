import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";
import {indexMiddleware} from "./indexMiddleware";

const sandbox = Sinon.createSandbox();
describe("indexMiddleware and redirect", () => {
  it("should create a middleware", () => {
    const res = new FakeResponse(sandbox);
    const req = new FakeRequest();
    const viewPath = "/swagger.ejs";
    const conf = {
      path: "/doc",
      options: {},
      showExplorer: false,
      cssPath: "/path.css",
      jsPath: "/path.js",
      urls: []
    };

    indexMiddleware(viewPath, conf)(req as any, res as any);

    expect(res.render).to.have.been.calledWithExactly(viewPath, {
      cssPath: "/path.css",
      jsPath: "/path.js",
      showExplorer: false,
      swaggerOptions: {},
      url: "/doc/swagger.json",
      urls: []
    });
  });
});
