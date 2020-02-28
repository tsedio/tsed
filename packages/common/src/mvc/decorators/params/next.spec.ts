import {EndpointInfo, Next, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@Next", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Next() arg: EndpointInfo) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.paramType.should.eq(ParamTypes.NEXT_FN);
  });
});
