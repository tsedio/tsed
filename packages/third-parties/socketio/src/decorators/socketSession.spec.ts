import {Store} from "@tsed/core";

import {RawSocketSession, SocketFilters, SocketSession} from "../index.js";

describe("SocketSession", () => {
  it("should set metadata", () => {
    class Test {}

    SocketSession(Test, "test", 0);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: SocketFilters.SESSION,
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});

describe("RawSocketSession", () => {
  it("should set metadata", () => {
    class Test {}

    RawSocketSession(Test, "test", 0);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: SocketFilters.RAW_SESSION,
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
