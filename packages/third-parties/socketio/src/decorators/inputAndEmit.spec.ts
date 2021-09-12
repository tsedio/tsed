import {Store} from "@tsed/core";
import {expect} from "chai";
import {InputAndEmit} from "../index";

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
