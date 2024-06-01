import {JsonEntityFn} from "../../index.js";

describe("JsonSchemaStoreFn", () => {
  it("should decorate property", () => {
    const stub = jest.fn();

    class Model {
      @JsonEntityFn(() => {
        return stub;
      })
      prop: string;
    }

    expect(stub).toHaveBeenCalledWith(Model.prototype, "prop", undefined);
  });
});
