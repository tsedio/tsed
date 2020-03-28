import {JsonSchemaStoreFn} from "@tsed/schema";
import * as Sinon from "sinon";

describe("JsonSchemaStoreFn", () => {
  it("should decorate property", () => {
    const stub = Sinon.stub();

    class Model {
      @JsonSchemaStoreFn(() => {
        return stub;
      })
      prop: string;
    }

    stub.should.have.been.calledWithExactly(Model.prototype, "prop", undefined);
  });
});
