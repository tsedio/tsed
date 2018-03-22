import {Schema} from "mongoose";
import {Store} from "../../../../src/core/class/Store";
import {descriptorOf} from "../../../../src/core/utils";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../../../../src/mongoose/constants";
import {Ref} from "../../../../src/mongoose/decorators";
import {expect} from "../../../tools";

describe("@Ref()", () => {
    class Test {
    }

    class RefTest {
    }

    before(() => {
        Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");
        Ref(RefTest)(Test, "test", descriptorOf(Test, "test"));
        this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });

    it("should set metadata", () => {
        expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
            type: Schema.Types.ObjectId,
            ref: "RefTest"
        });
    });
});