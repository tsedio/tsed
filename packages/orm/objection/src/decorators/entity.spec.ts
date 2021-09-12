import {Entity} from "@tsed/objection";
import {expect} from "chai";

describe("@Entity", () => {
  it("should set metadata", () => {
    @Entity("models")
    class MyModel {}

    expect((MyModel as any).jsonSchema).to.deep.eq({
      type: "object"
    });
    expect((MyModel as any).tableName).to.deep.eq("models");
  });

  it("should throw metadata when the tableName is empty", () => {
    let actualError: any;
    try {
      @Entity("")
      class MyModel {}
    } catch (er) {
      actualError = er;
    }
    expect(actualError.message).to.deep.eq("Please provide a table name");
  });
});
