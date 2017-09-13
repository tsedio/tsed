import {Store} from "../../../../src/core/class/Store";
import {descriptorOf} from "../../../../src/core/utils";
import {Returns} from "../../../../src/swagger/decorators/returns";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Returns()", () => {
    before(() => {
        Returns(400, {
            description: "Bad Request"
        })(Test, "test", descriptorOf(Test, "test"));
        this.store = Store.fromMethod(Test, "test");
    });
    it("should set the responses", () => {
        expect(this.store.get("responses")).to.deep.eq({
            "400": {
                "collectionType": undefined,
                "description": "Bad Request",
                "headers": undefined,
                "type": undefined
            }
        });
    });
});