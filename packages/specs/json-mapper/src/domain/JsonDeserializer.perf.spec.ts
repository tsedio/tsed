import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {CollectionOf, Property} from "@tsed/schema";

import {DateMapper} from "../components/DateMapper.js";
import {PrimitiveMapper} from "../components/PrimitiveMapper.js";
import {JsonDeserializer} from "./JsonDeserializer.js";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer.js";

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

const at = "2022-10-02T00:00:00.000Z";

function rawItem(label = "a") {
  return {count: "1", label, at, scores: ["1", "2"]};
}

describe("JsonDeserializer type mappers", () => {
  it("should not register the type mappers again on each call", () => {
    const deserializer = new JsonDeserializer();
    deserializer.map(rawItem(), {type: Item});

    const addTypeMapper = vi.spyOn(deserializer, "addTypeMapper");
    const result = deserializer.map(rawItem(), {type: Item});

    expect(addTypeMapper).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Item);
    expect(result).toEqual(Object.assign(new Item(), {count: 1, label: "a", at: new Date(at), scores: [1, 2]}));
  });

  it("should use a mapper replaced in the types between two calls", () => {
    const deserializer = new JsonDeserializer();
    const types = new Map<any, any>(getJsonMapperTypes());

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(new Date(at));

    types.set(Date, {serialize: (value: any) => value, deserialize: (value: any) => `date:${value}`});

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(`date:${at}`);
  });

  it("should register a type mapper again once it was removed or replaced", () => {
    const deserializer = new JsonDeserializer();
    const expected = Object.assign(new Item(), {count: 1, label: "a", at: new Date(at), scores: [1, 2]});

    expect(deserializer.map(rawItem(), {type: Item})).toEqual(expected);

    deserializer.removeTypeMapper(Number);
    deserializer.addTypeMapper(String, () => "replaced");

    expect(deserializer.map(rawItem(), {type: Item})).toEqual(expected);
  });

  it("should follow a conversion method replaced after the first call", () => {
    const mapper: any = new PrimitiveMapper();
    mapper.Number = (data: any) => Number(data) + 1;

    const deserializer = new JsonDeserializer();
    const types = new Map<any, any>(getJsonMapperTypes());
    types.set(Number, mapper);

    expect(deserializer.map(rawItem(), {type: Item, types}).count).toEqual(2);

    mapper.Number = (data: any) => Number(data) + 10;

    expect(deserializer.map(rawItem(), {type: Item, types}).count).toEqual(11);
  });

  it("should follow a deserialize method replaced after the first call", () => {
    const mapper: any = new DateMapper();

    const deserializer = new JsonDeserializer();
    const types = new Map<any, any>(getJsonMapperTypes());
    types.set(Date, mapper);

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(new Date(at));

    mapper.deserialize = () => "deserialized";

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual("deserialized");
  });
});

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
