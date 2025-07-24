import "../../index.js";

import {OperationVerbs} from "../../constants/OperationVerbs.js";
import {inspectOperationsPaths} from "../../domain/__fixtures__/inspectOperationsPaths.js";
import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {Publish} from "./publish.js";

describe("Publish", () => {
  it("should register operation with Publish verb", () => {
    // WHEN
    class Test {
      @Publish("event")
      test() {}
    }

    const endpoint = JsonEntityStore.fromMethod(Test, "test");

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
