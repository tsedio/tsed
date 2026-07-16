import {Broadcast} from "../index.js";
import {Store} from "@tsed/core";

describe("Broadcast", () => {
  it("should set metadata", () => {
    class Test {}

    Broadcast("eventName")(Test, "test", {} as any);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          returns: {
            eventName: "eventName",
            type: "broadcast"
          }
        }
      }
    });
  });
});
