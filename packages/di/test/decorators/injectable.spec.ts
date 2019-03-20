import * as Sinon from "sinon";
import {Injectable} from "../../src/decorators/injectable";
import {ProviderScope} from "../../src/interfaces";
import * as ProviderRegistry from "../../src/registries/ProviderRegistry";

describe("@Injectable()", () => {
  const sandbox = Sinon.createSandbox();

  class Test {
  }

  describe("with options", () => {
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

  describe("without options", () => {
    before(() => {
      sandbox.stub(ProviderRegistry, "registerProvider");

      Injectable()(Test);
    });

    after(() => {
      sandbox.restore();
    });

    it("should called registerProvider", () => {
      ProviderRegistry.registerProvider.should.have.been.calledWithExactly({
        provide: Test,
        scope: ProviderScope.SINGLETON
      });
    });
  });
});
