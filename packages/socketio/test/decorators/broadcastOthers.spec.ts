import {Store} from "@tsed/core";
import {expect} from "chai";
import {BroadcastOthers} from "../../src";

describe("BroadcastOthers", () => {
  class Test {
  }

  before(() => {
    BroadcastOthers("eventName")(Test, "test", {} as any);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          returns: {
            eventName: "eventName",
            type: "broadcastOthers"
          }
        }
      }
    });
  });
});
