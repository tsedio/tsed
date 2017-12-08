import {Store} from "../../../../src/core/class/Store";
import {BroadcastOthers} from "../../../../src/socketio";
import {expect} from "../../../tools";


describe("BroadcastOthers", () => {

    class Test {
    }

    before(() => {
        BroadcastOthers("eventName")(Test, "test", {} as any);
        this.store = Store.from(Test);
    });

    it("should set metadata", () => {
        expect(this.store.get("socketIO")).to.deep.eq({
            "handlers": {
                "test": {
                    returns: {
                        eventName: "eventName",
                        type: "broadcastOthers"
                    }
                }
            }
        });
    });
});