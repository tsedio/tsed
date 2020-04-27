import {Configuration} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import * as Sinon from "sinon";
import { nameOf } from '@tsed/core/src';

@Configuration({
  logger: {
    level: "off"
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
    const server = await PlatformExpress.bootstrap(Server);

    console.log(Array.from(server.injector.keys()).map(nameOf));

    return Server.prototype.$beforeRoutesInit.should.have.been.calledOnce;
  });
});
