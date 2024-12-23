import "../../index.js";

import {OperationVerbs} from "../../constants/OperationVerbs.js";
import {inspectOperationsPaths} from "../../domain/__fixtures__/inspectOperationsPaths.js";
import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {Publish} from "./publish.js";
import {Subscribe} from "./subscribe.js";

describe("Subscribe", () => {
  it("should register operation with Subscribe verb", () => {
    // WHEN
    class Test {
      @Publish("event")
      @Subscribe("event")
      test() {}
    }

    const endpoint = JsonEntityStore.fromMethod(Test, "test");

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
