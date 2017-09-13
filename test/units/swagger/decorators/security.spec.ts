import {Store} from "../../../../src/core/class/Store";
import {Security} from "../../../../src/swagger/decorators/security";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Security()", () => {
    before(() => {
        Security("securityDefinitionName", "scope1", "scope2")(Test, "test");
        this.store = Store.from(Test, "test", this.descriptor);
    });
    it("should set the security", () => {
        expect(this.store.get("security")).to.deep.eq([
            {
                "securityDefinitionName": [
                    "scope1",
                    "scope2"
                ]
            }
        ]);
    });
});