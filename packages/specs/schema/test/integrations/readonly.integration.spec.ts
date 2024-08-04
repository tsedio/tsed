import {getJsonSchema, Groups, Name, Property, ReadOnly, Required} from "../../src/index.js";

class BaseModel {
  @Required()
  @ReadOnly()
  @Name("updated_at")
  @Groups("!create", "!update")
  updatedAt: number = Date.now();
}

class DataSourceModel extends BaseModel {
  @Property()
  @ReadOnly()
  get test() {
    return "test";
  }
}

describe("schema: ReadOnly", () => {
  it("should generate json schema", () => {
    const jsonSchema = getJsonSchema(DataSourceModel);

    expect(jsonSchema).toMatchSnapshot();
  });
});
