import {expect} from "chai";
import {EndpointInfo, Err, ParamMetadata, ParamTypes} from "../../../../src/mvc";

describe("@Err", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Err() arg: EndpointInfo) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.ERR);
  });
});
