import {Store} from "../../../../src/core/class/Store";
import {SocketService} from "../../../../src/socketio";
import {expect} from "../../../tools";

describe("SocketService", () => {

    describe("case 1", () => {
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
    describe("case 2", () => {
        class Test {
        }

        before(() => {
            SocketService()(Test);
            this.store = Store.from(Test);
        });

        it("should set metadata", () => {
            expect(this.store.get("socketIO")).to.deep.eq({
                namespace: "/"
            });
        });
    });

});