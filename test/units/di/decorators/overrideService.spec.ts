import {OverrideProvider} from "../../../../packages/common/src/di/decorators/overrideProvider";
import {OverrideService} from "../../../../packages/common/src/di/decorators/overrideService";
import {expect} from "../../../tools";

describe("OverrideService", () => {
  it("should use OverrideProvider", () => {
    expect(OverrideService).to.eq(OverrideProvider);
  });
});
