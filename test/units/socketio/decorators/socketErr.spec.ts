import {Store} from "../../../../packages/core/class/Store";
import {SocketErr} from "../../../../packages/socketio";
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
