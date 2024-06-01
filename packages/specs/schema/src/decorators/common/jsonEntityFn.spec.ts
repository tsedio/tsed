import {JsonEntityFn} from "../../index.js";
import Sinon from "sinon";

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
