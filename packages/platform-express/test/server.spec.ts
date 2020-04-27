import {Configuration} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import * as Sinon from "sinon";

@Configuration({
  logger: {
    level: "off"
  },
  statics: {
    "/": "views"
  }
})
class Server {
  $beforeRoutesInit() {

  }
}

const sandbox = Sinon.createSandbox();
describe("bootstrap", () => {
  beforeEach(() => {
    sandbox.stub(Server.prototype, "$beforeRoutesInit");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should call once the $beforeRouteInits hooks", async () => {
    await PlatformExpress.bootstrap(Server);

    return Server.prototype.$beforeRoutesInit.should.have.been.calledOnce;
  });
});
