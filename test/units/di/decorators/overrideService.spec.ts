import {OverrideProvider} from "../../../../packages/di/src/decorators/overrideProvider";
import {OverrideService} from "../../../../packages/di/src/decorators/overrideService";
import {expect} from "chai";

describe("OverrideService", () => {
  it("should use OverrideProvider", () => {
    expect(OverrideService).to.eq(OverrideProvider);
  });
});
