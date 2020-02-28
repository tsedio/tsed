import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, Res} from "../../../../src/mvc";

describe("@Res", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Res() arg: Res) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.paramType.should.eq(ParamTypes.RESPONSE);
  });
});
