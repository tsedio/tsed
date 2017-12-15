import {Store} from "../../../../src/core/class/Store";
import {Input} from "../../../../src/socketio";
import {expect} from "../../../tools";

describe("Input", () => {

    class Test {
    }

    before(() => {
        Input("eventName")(Test, "test", {} as any);
        this.store = Store.from(Test);
    });

    it("should set metadata", () => {
        expect(this.store.get("socketIO")).to.deep.eq({
            "handlers": {
                "test": {
                    "eventName": "eventName",
                    "methodClassName": "test"
                }
            }
        });
    });
});