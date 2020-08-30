import {Store} from "@tsed/core";
import {expect} from "chai";
import {Broadcast} from "../index";

describe("Broadcast", () => {
  class Test {}

  before(() => {
    Broadcast("eventName")(Test, "test", {} as any);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          returns: {
            eventName: "eventName",
            type: "broadcast",
          },
        },
      },
    });
  });
});
