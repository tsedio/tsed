import {Store} from "../../../../src/core/class/Store";
import {Broadcast} from "../../../../src/socketio";
import {expect} from "../../../tools";


describe("Broadcast", () => {

    class Test {
    }

    before(() => {
        Broadcast("eventName")(Test, "test", {} as any);
        this.store = Store.from(Test);
    });

    it("should set metadata", () => {
        expect(this.store.get("socketIO")).to.deep.eq({
            "handlers": {
                "test": {
                    returns: {
                        eventName: "eventName",
                        type: "broadcast"
                    }
                }
            }
        });
    });
});