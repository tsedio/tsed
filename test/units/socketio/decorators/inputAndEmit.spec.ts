import {Store} from "../../../../packages/core/src/class/Store";
import {InputAndEmit} from "../../../../packages/socketio/src";
import {expect} from "../../../tools";

describe("InputAndEmit", () => {
  class Test {}

  before(() => {
    InputAndEmit("eventName")(Test, "test", {} as any);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          eventName: "eventName",
          methodClassName: "test",
          returns: {
            eventName: "eventName",
            type: "emit"
          }
        }
      }
    });
  });
});
