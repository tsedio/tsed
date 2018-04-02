import {OverrideProvider} from "../../../../src/common/di/decorators/overrideProvider";
import {OverrideService} from "../../../../src/common/di/decorators/overrideService";
import {expect} from "../../../tools";

describe("OverrideService", () => {
    it("should use OverrideProvider", () => {
        expect(OverrideService).to.eq(OverrideProvider);
    });
});