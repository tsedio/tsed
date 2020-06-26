import {expect} from "chai";
import {EndpointInfo, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@EndpointInfo", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@EndpointInfo() arg: EndpointInfo) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.ENDPOINT_INFO);
  });
});
