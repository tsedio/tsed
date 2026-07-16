import {BroadcastOthers} from "../index.js";
import {Store} from "@tsed/core";

describe("BroadcastOthers", () => {
  it("should set metadata", () => {
    class Test {}

    BroadcastOthers("eventName")(Test, "test", {} as any);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
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
