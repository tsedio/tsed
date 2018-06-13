import {Store} from "../../../../src/core/class/Store";
import {SocketErr} from "../../../../src/socketio";
import {expect} from "../../../tools";

describe("@SocketErr", () => {
  class Test {}

  before(() => {
    SocketErr(Test, "test", 0);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "error",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
