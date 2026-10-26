import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {CollectionOf, Property} from "@tsed/schema";

import {JsonDeserializer} from "./JsonDeserializer.js";

class Item {
  @Property()
  count: number;

  @Property()
  label: string;

  @Property()
  at: Date;

  @CollectionOf(Number)
  scores: number[];
}

class Basket {
  @CollectionOf(String)
  tags: string[];

  @CollectionOf(Item)
  items: Item[];

  @CollectionOf(Item)
  itemSet: Set<Item>;

  @CollectionOf(Item)
  itemMap: Map<string, Item>;
}

function rawItem(label = "a") {
  return {count: "1", label, at: "2022-10-02T00:00:00.000Z", scores: ["1", "2"]};
}

describe("JsonDeserializer collections", () => {
  let deserializer: JsonDeserializer;

  beforeEach(() => {
    deserializer = new JsonDeserializer();
  });

  it("should map a single value given to an array property as a one-item array", () => {
    const result = deserializer.map({tags: "a", items: rawItem()}, {type: Basket});

    expect(result.tags).toEqual(["a"]);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toBeInstanceOf(Item);
    expect(result.items[0].scores).toEqual([1, 2]);
  });

  it("should map every item of an array, Set and Map of models", () => {
    const result = deserializer.map(
      {
        items: [rawItem("a"), rawItem("b")],
        itemSet: [rawItem("c")],
        itemMap: {x: rawItem("d")}
      },
      {type: Basket}
    );

    expect(result.items.map((item: Item) => item.label)).toEqual(["a", "b"]);
    expect(result.items.every((item: Item) => item instanceof Item && item.at instanceof Date)).toBe(true);
    expect(result.itemSet).toBeInstanceOf(Set);
    expect([...result.itemSet][0]).toBeInstanceOf(Item);
    expect([...result.itemSet][0].scores).toEqual([1, 2]);
    expect(result.itemMap).toBeInstanceOf(Map);
    expect(result.itemMap.get("x")).toBeInstanceOf(Item);
    expect(result.itemMap.get("x").count).toEqual(1);
  });

  it("should map a top-level collection of models", () => {
    const result = deserializer.map([rawItem("a"), rawItem("b")], {type: Item, collectionType: Array});

    expect(result).toHaveLength(2);
    expect(result[1]).toBeInstanceOf(Item);
    expect(result[1].scores).toEqual([1, 2]);
  });

  it("should keep the holes of a sparse array without calling the item mapper", () => {
    const tags = ["a", , "b"];

    const result = deserializer.map({tags}, {type: Basket});

    expect(result.tags).toHaveLength(3);
    expect(1 in result.tags).toBe(false);
    expect(result.tags[0]).toBe("a");
    expect(result.tags[2]).toBe("b");
  });
});
