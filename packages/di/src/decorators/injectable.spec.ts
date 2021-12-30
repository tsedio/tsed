import {Injectable} from "@tsed/di";
import {expect} from "chai";
import {stub, restore} from "sinon";
import * as ProviderRegistry from "../../src/registries/ProviderRegistry";

describe("@Injectable()", () => {
  before(() => stub(ProviderRegistry, "registerProvider"));

  after(() => restore());

  it("should call `registerProvider` setting `provide` according to the target class", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable()(Test);

    // THEN
    expect(ProviderRegistry.registerProvider).to.have.been.calledWithExactly({
      provide: Test
    });
  });

  it("should call `registerProvider` passing an additional options", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable({options: "options"})(Test);

    // THEN
    expect(ProviderRegistry.registerProvider).to.have.been.calledWithExactly({
      options: "options",
      provide: Test
    });
  });

  it("should override `provide`", () => {
    // GIVEN
    class Test {}
    const provide = "custom";

    // WHEN
    Injectable({provide})(Test);

    // THEN
    expect(ProviderRegistry.registerProvider).to.have.been.calledWithExactly({
      provide,
      useClass: Test
    });
  });
});
