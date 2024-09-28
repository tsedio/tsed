import {Groups, Property, Required, WriteOnly} from "@tsed/schema";

import {deserialize} from "../../src/utils/deserialize.js";
import {serialize} from "../../src/utils/serialize.js";

class DataSourceModel {
  @Required()
  @Groups("!create")
  _id: string;

  #test: string;

  @Property()
  @WriteOnly()
  set test(test: string) {
    this.#test = test;
  }

  getTest() {
    return this.#test;
  }
}

describe("JsonMapper: WriteOnly", () => {
  it("should serialize object", () => {
    const instance = new DataSourceModel();
    instance._id = "id";
    instance.test = "hello";

    const obj = serialize(instance, {type: DataSourceModel});

    expect(obj).toEqual({_id: "id"});
  });

  it("should deserialize object", () => {
    const instance = new DataSourceModel();
    instance._id = "id";

    const obj = deserialize({test: "new", _id: "id"}, {type: DataSourceModel});

    expect(obj).toEqual({_id: "id"});
    expect(obj.getTest()).toEqual("new");
  });
});
