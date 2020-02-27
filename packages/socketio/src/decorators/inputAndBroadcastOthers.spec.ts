import {Store} from "@tsed/core";
import {expect} from "chai";
import {InputAndBroadcastOthers} from "../index";

describe("InputAndBroadcastOthers", () => {
  class Test {}

  before(() => {
    InputAndBroadcastOthers("eventName")(Test, "test", {} as any);
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
            type: "broadcastOthers"
          }
        }
      }
    });
  });
});
