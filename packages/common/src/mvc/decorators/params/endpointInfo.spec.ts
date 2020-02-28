import {EndpointInfo, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@EndpointInfo", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@EndpointInfo() arg: EndpointInfo) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.paramType.should.eq(ParamTypes.ENDPOINT_INFO);
  });
});
