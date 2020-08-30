import {expect} from "chai";
import {ParamMetadata, ParamTypes, Response} from "../../../../src/mvc";

describe("@Res", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Response() arg: Response) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.RESPONSE);
  });
});
