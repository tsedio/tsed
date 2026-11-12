import {In, JsonParameterStore, OperationPath, Property} from "@tsed/schema";

import {deserialize} from "../utils/deserialize.js";
import {JsonMapperSettings} from "./JsonMapperSettings.js";

class Product {
  @Property()
  title: string;
}

class Controller {
  @OperationPath("POST", "/")
  method(@In("body") product: Product) {
    return null;
  }
}

const store = () => JsonParameterStore.get(Controller, "method", 0);

describe("JsonDeserializer options of a parameter store", () => {
  it("should not keep the collection type of an array input for the next call", () => {
    const list = deserialize([{title: "a"}], {store: store()});
    const one = deserialize({title: "b"}, {store: store()});

    expect(list).toEqual([{title: "a"}]);
    expect(list[0]).toBeInstanceOf(Product);
    expect(one).toBeInstanceOf(Product);
    expect(one).toEqual({title: "b"});
  });

  it("should follow a change of the global settings", () => {
    const previous = JsonMapperSettings.additionalProperties;

    try {
      JsonMapperSettings.additionalProperties = false;
      expect(deserialize({title: "a", extra: 1}, {store: store()})).toEqual({title: "a"});

      JsonMapperSettings.additionalProperties = true;
      expect(deserialize({title: "a", extra: 1}, {store: store()})).toEqual({title: "a", extra: 1});
    } finally {
      JsonMapperSettings.additionalProperties = previous;
    }
  });
});
