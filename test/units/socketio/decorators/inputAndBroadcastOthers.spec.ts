import {Store} from "../../../../src/core/class/Store";
import {InputAndBroadcastOthers} from "../../../../src/socketio";
import {expect} from "../../../tools";


describe("InputAndBroadcastOthers", () => {

    class Test {
    }

    before(() => {
        InputAndBroadcastOthers("eventName")(Test, "test", {} as any);
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
                        type: "broadcastOthers"
                    }
                }
            }
        });
    });
});