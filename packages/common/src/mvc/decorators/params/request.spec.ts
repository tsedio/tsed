import {expect} from "chai";
import {ParamMetadata, ParamTypes, Req} from "../../../../src/mvc";

describe("@Req", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Req() arg: Req) {
      }
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.REQUEST);
  });
});
