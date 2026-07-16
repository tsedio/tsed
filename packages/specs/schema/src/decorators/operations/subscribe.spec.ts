import "../../index.js";
import {OperationVerbs} from "../../constants/OperationVerbs.js";
import {Publish} from "./publish.js";
import {Subscribe} from "./subscribe.js";
import {inspectOperationsPaths} from "../../domain/__fixtures__/inspectOperationsPaths.js";
import {s} from "../../fn/index.js";

describe("Subscribe", () => {
  it("should register operation with Subscribe verb", () => {
    // WHEN
    class Test {
      @Publish("event")
      @Subscribe("event")
      test() {}
    }

    const endpoint = s.store.method(Test, "test");

    // THEN
    expect(inspectOperationsPaths(endpoint)).toEqual([
      {
        method: OperationVerbs.SUBSCRIBE,
        path: "event"
      },
      {
        method: OperationVerbs.PUBLISH,
        path: "event"
      }
    ]);
    expect(endpoint.propertyKey).toBe("test");
  });
});
