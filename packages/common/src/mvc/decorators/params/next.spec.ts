import {expect} from "chai";
import {EndpointInfo, Next, ParamMetadata, ParamTypes} from "../../../../src/mvc";

describe("@Next", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Next() arg: EndpointInfo) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.NEXT_FN);
  });
});
