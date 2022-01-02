import {ParamTypes} from "@tsed/platform-params";
import {expect} from "chai";
import {EndpointInfo} from "./endpointInfo";
import {JsonParameterStore} from "@tsed/schema";

describe("@EndpointInfo", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@EndpointInfo() arg: EndpointInfo) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.$CTX);
  });
});
