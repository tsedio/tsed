import {Groups, Property, ReadOnly, Required} from "@tsed/schema";

import {deserialize} from "../../src/utils/deserialize.js";
import {serialize} from "../../src/utils/serialize.js";

class DataSourceModel {
  @Required()
  @Groups("!create")
  _id: string;

  @Property()
  @ReadOnly()
  get test() {
    return "test";
  }
}

describe("JsonMapper: ReadOnly", () => {
  it("should serialize object", () => {
    const instance = new DataSourceModel();
    instance._id = "id";
    const obj = serialize(instance, {type: DataSourceModel});

    expect(obj).toEqual({_id: "id", test: "test"});
  });
  it("should deserialize object", () => {
    const instance = new DataSourceModel();
    instance._id = "id";
    const obj = deserialize({test: "hello", _id: "id"}, {type: DataSourceModel});

    expect(obj).toEqual({_id: "id"});
    expect(obj.test).toEqual("test");
  });
});
