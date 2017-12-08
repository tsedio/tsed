import {Store} from "../../../../src/core/class/Store";
import {Args} from "../../../../src/socketio";
import {expect} from "../../../tools";


describe("Args", () => {

    describe("without parameters", () => {
        class Test {
        }

        before(() => {
            Args()(Test, "test", 0);
            this.store = Store.from(Test);
        });

        it("should set metadata", () => {
            expect(this.store.get("socketIO")).to.deep.eq({
                "handlers": {
                    "test": {
                        "parameters": {
                            "0": {
                                "mapIndex": undefined,
                                "filter": "args"
                            }
                        }
                    }
                }
            });
        });
    });

    describe("with parameters", () => {
        class Test {
        }

        before(() => {
            Args(1)(Test, "test", 1);
            this.store = Store.from(Test);
        });

        it("should set metadata", () => {
            expect(this.store.get("socketIO")).to.deep.eq({
                "handlers": {
                    "test": {
                        "parameters": {
                            "1": {
                                "mapIndex": 1,
                                "filter": "args"
                            }
                        }
                    }
                }
            });
        });
    });
});