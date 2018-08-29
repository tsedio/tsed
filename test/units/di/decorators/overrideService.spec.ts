import {OverrideProvider} from "../../../../packages/common/di/decorators/overrideProvider";
import {OverrideService} from "../../../../packages/common/di/decorators/overrideService";
import {expect} from "../../../tools";

describe("OverrideService", () => {
  it("should use OverrideProvider", () => {
    expect(OverrideService).to.eq(OverrideProvider);
  });
});
