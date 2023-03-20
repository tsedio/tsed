import {Entity} from "./entity";

describe("@Entity", () => {
  it("should set metadata", () => {
    @Entity("models")
    class MyModel {}

    expect((MyModel as any).jsonSchema).toEqual({
      type: "object"
    });
    expect((MyModel as any).tableName).toEqual("models");
  });

  it("should throw metadata when the tableName is empty", () => {
    let actualError: any;
    try {
      @Entity("")
      class MyModel {}
    } catch (er) {
      actualError = er;
    }
    expect(actualError.message).toEqual("Please provide a table name");
  });
});
