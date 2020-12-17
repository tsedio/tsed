import {expect} from "chai";
import Sinon from "sinon";
import {GlobalProviders, Provider} from "../../src";
import {OverrideProvider} from "../../src/decorators/overrideProvider";

describe("OverrideProvider", () => {
  class Test {}

  class Test2 {}

  before(() => {
    Sinon.stub(GlobalProviders, "get");
  });
  after(() => {
    // @ts-ignore
    GlobalProviders.get.restore();
  });
  it("should use OverrideProvider", () => {
    // GIVEN
    const provider = new Provider(Test);

    // @ts-ignore
    GlobalProviders.get.withArgs(Test).returns(provider);

    // WHEN
    OverrideProvider(Test)(Test2);

    // THEN
    expect(provider.provide).to.eq(Test);
    expect(provider.useClass).to.eq(Test2);
  });
});
