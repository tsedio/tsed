import {Injectable} from "../../../../packages/common/src/di/decorators/injectable";
import * as ProviderRegistry from "../../../../packages/common/src/di/registries/ProviderRegistry";
import {Sinon} from "../../../tools";

describe("@Injectable()", () => {
  const sandbox = Sinon.createSandbox();

  class Test {}

  before(() => {
    sandbox.stub(ProviderRegistry, "registerProvider");

    Injectable({options: "options"})(Test);
  });

  after(() => {
    sandbox.restore();
  });

  it("should called registerProvider", () => {
    ProviderRegistry.registerProvider.should.have.been.calledWithExactly({
      options: "options",
      provide: Test
    });
  });
});
