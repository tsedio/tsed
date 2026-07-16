import "../../index.js";
import {OperationVerbs} from "../../constants/OperationVerbs.js";
import {Publish} from "./publish.js";
import {inspectOperationsPaths} from "../../domain/__fixtures__/inspectOperationsPaths.js";
import {s} from "../../fn/index.js";

describe("Publish", () => {
  it("should register operation with Publish verb", () => {
    // WHEN
    class Test {
      @Publish("event")
      test() {}
    }

    const endpoint = s.store.method(Test, "test");

    // THEN
    expect(inspectOperationsPaths(endpoint)).toEqual([
      {
        method: OperationVerbs.PUBLISH,
        path: "event"
      }
    ]);
    expect(endpoint.propertyKey).toBe("test");
  });
});
