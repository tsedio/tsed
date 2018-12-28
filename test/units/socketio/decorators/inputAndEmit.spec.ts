import {Store} from "@tsed/core";
import {InputAndEmit} from "../../../../packages/socketio/src";
import {expect} from "chai";

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
