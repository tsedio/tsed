import {Store} from "../../../../src/core/class/Store";
import {InputAndEmit} from "../../../../src/socketio";
import {expect} from "../../../tools";


describe("InputAndEmit", () => {

    class Test {
    }

    before(() => {
        InputAndEmit("eventName")(Test, "test", {} as any);
        this.store = Store.from(Test);
    });

    it("should set metadata", () => {
        expect(this.store.get("socketIO")).to.deep.eq({
            "handlers": {
                "test": {
                    "eventName": "eventName",
                    "methodClassName": "test",
                    returns: {
                        eventName: "eventName",
                        type: "emit"
                    }
                }
            }
        });
    });
});