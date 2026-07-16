import {InputAndBroadcastOthers} from "../index.js";
import {Store} from "@tsed/core";

describe("InputAndBroadcastOthers", () => {
  it("should set metadata", () => {
    class Test {}

    InputAndBroadcastOthers("eventName")(Test, "test", {} as any);
    const store = Store.from(Test);
    expect(store.get("socketIO")).toEqual({
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
