import {Store} from "@tsed/core";
import {expect} from "chai";
import {Socket} from "../index";

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
              mapIndex: undefined,
            },
          },
        },
      },
    });
  });
});
