import {expect} from "chai";
import {ParamMetadata, ParamTypes, ResponseData} from "../../../../src/mvc";

describe("@ResponseData", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@ResponseData() arg: any) {
      }
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.RESPONSE_DATA);
  });
});
