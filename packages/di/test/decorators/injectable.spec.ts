import * as Sinon from "sinon";
import {Injectable, ProviderScope} from "../../src";
import * as ProviderRegistry from "../../src/registries/ProviderRegistry";

describe("@Injectable()", () => {
  const sandbox = Sinon.createSandbox();


  describe("with options", () => {
    before(() => {
      sandbox.stub(ProviderRegistry, "registerProvider");
    });

    after(() => {
      sandbox.restore();
    });

    it("should called registerProvider", () => {
      // GIVEN
      class Test {
      }

      // WHEN
      Injectable({options: "options"})(Test);

      // THEN
      ProviderRegistry.registerProvider.should.have.been.calledWithExactly({
        options: "options",
        provide: Test
      });
    });
  });

  describe("without options", () => {
    before(() => {
      sandbox.stub(ProviderRegistry, "registerProvider");
    });

    after(() => {
      sandbox.restore();
    });

    it("should called registerProvider", () => {
      // GIVEN
      class Test {
      }

      // WHEN
      Injectable()(Test);

      // THEN
      ProviderRegistry.registerProvider.should.have.been.calledWithExactly({
        provide: Test,
        scope: ProviderScope.SINGLETON
      });
    });
  });
});
