import {CollectionOf, Groups, Property} from "@tsed/schema";

import {deserialize} from "../../src/utils/deserialize.js";

class Product {
  @Groups("!creation")
  id: string;

  @Property()
  label: string = "default label";

  @Groups("group.summary")
  price: number;

  @Groups("group.extended")
  description: string;

  @CollectionOf(String)
  @Groups("creation")
  tags: string[];
}

describe("Partial", () => {
  it("should deserialize object without partial", () => {
    const product = deserialize(
      {
        id: "id"
      },
      {type: Product}
    );

    expect(product).toEqual({
      id: "id",
      label: "default label"
    });
  });
  it("should deserialize object without partial and label", () => {
    const product = deserialize(
      {
        id: "id",
        label: "label"
      },
      {type: Product}
    );

    expect(product).toEqual({
      id: "id",
      label: "label"
    });
  });
  it("should deserialize object with partial value", () => {
    const product = deserialize(
      {
        id: "id"
      },
      {type: Product, groups: ["partial"]}
    );

    expect(product).toEqual({
      id: "id"
    });
  });
  it("should deserialize object with partial value and label", () => {
    const product = deserialize(
      {
        id: "id",
        label: "label"
      },
      {type: Product, groups: ["partial"]}
    );

    expect(product).toEqual({
      id: "id",
      label: "label"
    });
  });
});
