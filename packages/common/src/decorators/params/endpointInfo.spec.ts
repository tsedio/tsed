import {ParamMetadata, ParamTypes} from "@tsed/platform-params";
import {expect} from "chai";
import {EndpointInfo} from "./endpointInfo";

describe("@EndpointInfo", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@EndpointInfo() arg: EndpointInfo) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.$CTX);
  });
});
