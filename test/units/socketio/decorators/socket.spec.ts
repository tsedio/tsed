import {Store} from "../../../../packages/core/src/class/Store";
import {Socket} from "../../../../packages/socketio/src";
import {expect} from "../../../tools";

describe("Socket", () => {
  class Test {}

  before(() => {
    Socket(Test, "test", 0);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "socket",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
