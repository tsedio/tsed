import {Store} from "@tsed/core";
import {SocketSession} from "../../../../packages/socketio/src";
import {expect} from "../../../tools";

describe("SocketSession", () => {
  class Test {}

  before(() => {
    SocketSession(Test, "test", 0);
    this.store = Store.from(Test);
  });

  it("should set metadata", () => {
    expect(this.store.get("socketIO")).to.deep.eq({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "session",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
