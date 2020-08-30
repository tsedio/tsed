import {Store} from "@tsed/core";
import {expect} from "chai";
import {SocketEventName} from "../index";

describe("@SocketEventName", () => {
  class Test {}

  before(() => {
    SocketEventName(Test, "test", 0);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "eventName",
              mapIndex: undefined,
            },
          },
        },
      },
    });
  });
});
