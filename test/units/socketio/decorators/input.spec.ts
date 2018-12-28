import {Store} from "@tsed/core";
import {Input} from "../../../../packages/socketio/src";
import {expect} from "../../../tools";

describe("Input", () => {
  class Test {}

  before(() => {
    Input("eventName")(Test, "test", {} as any);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          eventName: "eventName",
          methodClassName: "test"
        }
      }
    });
  });
});
