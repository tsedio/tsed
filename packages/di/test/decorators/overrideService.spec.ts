import {expect} from "chai";
import {OverrideProvider} from "../../src/decorators/overrideProvider";
import {OverrideService} from "../../src/decorators/overrideService";

describe("OverrideService", () => {
  it("should use OverrideProvider", () => {
    expect(OverrideService).to.eq(OverrideProvider);
  });
});
