import {ValidationService} from "../../../../src/filters";
import {expect} from "../../../tools";

describe("ValidationService", () => {
    it("should return true", () => {
        expect(new ValidationService().validate({}, {})).to.be.true;
    });
});