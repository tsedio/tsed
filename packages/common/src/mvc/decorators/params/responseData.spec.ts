import {ParamRegistry, ParamTypes, ResponseData} from "../../../../src/mvc";

describe("@ResponseData", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@ResponseData() arg: any) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.paramType.should.eq(ParamTypes.RESPONSE_DATA);
  });
});
