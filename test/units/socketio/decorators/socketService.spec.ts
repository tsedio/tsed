import {Store} from "../../../../src/core/class/Store";
import {SocketService} from "../../../../src/socketio";
import {expect} from "../../../tools";

describe("SocketService", () => {

    class Test {
    }

    before(() => {
        SocketService("/namespace")(Test);
        this.store = Store.from(Test);
    });

    it("should set metadata", () => {
        expect(this.store.get("socketIO")).to.deep.eq({
            namespace: "/namespace"
        });
    });
});