import {ContentType, EndpointRegistry} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";

const middleware: any = Sinon.stub();
const useAfterStub: any = Sinon.stub().returns(middleware);

class Test {}

describe("ContentType", () => {
  it("should create middleware", () => {
    class Test {
      @ContentType("application/json")
      test() {}
    }

    const store = Store.fromMethod(Test, "test");
    expect(store.get("produces")).to.deep.eq(["application/json"]);
    EndpointRegistry.get(Test, "test").afterMiddlewares.length.should.eq(1);
  });
});
