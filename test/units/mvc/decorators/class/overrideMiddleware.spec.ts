import {OverrideProvider} from "../../../../../packages/di/src/decorators/overrideProvider";
import {OverrideMiddleware} from "../../../../../packages/common/src/mvc/decorators/class/overrideMiddleware";
import {expect} from "chai";

describe("OverrideMiddleware", () => {
  it("should use OverrideProvider", () => {
    expect(OverrideMiddleware).to.eq(OverrideProvider);
  });
});
