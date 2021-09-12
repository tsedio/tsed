import {ParamMetadata, ParamTypes} from "@tsed/platform-params";
import {expect} from "chai";
import {Next} from "./next";

describe("@Next", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Next() arg: any) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.NEXT_FN);
  });
});
