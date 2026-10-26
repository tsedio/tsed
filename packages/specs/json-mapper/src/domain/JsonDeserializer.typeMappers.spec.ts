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

const at = "2022-10-02T00:00:00.000Z";

function rawItem() {
  return {count: "1", label: "a", at, scores: ["1", "2"]};
}

function expectedItem() {
  return Object.assign(new Item(), {count: 1, label: "a", at: new Date(at), scores: [1, 2]});
}

function typesWith(model: any, mapper: any) {
  return new Map<any, any>(getJsonMapperTypes()).set(model, mapper);
}

describe("JsonDeserializer type mappers", () => {
  it("should not register the type mappers again on each call", () => {
    const deserializer = new JsonDeserializer();
    deserializer.map(rawItem(), {type: Item});

    const addTypeMapper = vi.spyOn(deserializer, "addTypeMapper");
    const result = deserializer.map(rawItem(), {type: Item});

    expect(addTypeMapper).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Item);
    expect(result).toEqual(expectedItem());
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

    expect(deserializer.map(rawItem(), {type: Item})).toEqual(expectedItem());

    deserializer.removeTypeMapper(Number);
    deserializer.addTypeMapper(String, () => "replaced");

    expect(deserializer.map(rawItem(), {type: Item})).toEqual(expectedItem());
  });

  it("should follow a conversion method replaced after the first call", () => {
    const mapper: any = new PrimitiveMapper();
    mapper.Number = (data: any) => Number(data) + 1;

    const deserializer = new JsonDeserializer();
    const types = typesWith(Number, mapper);

    expect(deserializer.map(rawItem(), {type: Item, types}).count).toEqual(2);

    mapper.Number = (data: any) => Number(data) + 10;

    expect(deserializer.map(rawItem(), {type: Item, types}).count).toEqual(11);
  });

  it("should follow a deserialize method replaced after the first call", () => {
    const mapper: any = new DateMapper();

    const deserializer = new JsonDeserializer();
    const types = typesWith(Date, mapper);

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(new Date(at));

    mapper.deserialize = () => "deserialized";

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual("deserialized");
  });

  it("should use a conversion method added to the mapper after the first call", () => {
    const mapper: any = new DateMapper();

    const deserializer = new JsonDeserializer();
    const types = typesWith(Date, mapper);

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(new Date(at));

    mapper.Date = (value: any) => `converted:${value}`;

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(`converted:${at}`);
  });

  it("should keep the last of two mappers sharing a name when the first one changes", () => {
    const byName = {serialize: (value: any) => value, deserialize: (value: any) => `by-name:${value}`};
    const deserializer = new JsonDeserializer();
    // Date and "Date" both register the "Date" mapper: the last one in the types wins
    const types = new Map<any, any>(getJsonMapperTypes()).set(Date, new DateMapper()).set("Date", byName);

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(`by-name:${at}`);

    types.set(Date, {serialize: (value: any) => value, deserialize: (value: any) => `by-class:${value}`});

    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(`by-name:${at}`);
    expect(deserializer.map(rawItem(), {type: Item, types}).at).toEqual(`by-name:${at}`);
  });
});
