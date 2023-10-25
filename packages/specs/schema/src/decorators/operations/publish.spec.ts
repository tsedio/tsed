import {OperationVerbs} from "../../constants/OperationVerbs";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {Publish} from "./publish";
import {Get} from "./route";

describe("Publish", () => {
  it("should register operation with Publish verb", () => {
    // WHEN
    class Test {
      @Publish("event")
      test() {}
    }

    const endpoint = JsonEntityStore.fromMethod(Test, "test");

    // THEN
    expect([...endpoint.operation!.operationPaths.values()]).toEqual([
      {
        method: OperationVerbs.PUBLISH,
        path: "event"
      }
    ]);
    expect(endpoint.propertyKey).toBe("test");
  });
});
