import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {nameOf} from "@tsed/core";
import {Property} from "@tsed/schema";

import {PrimitiveMapper} from "../components/PrimitiveMapper.js";
import {JsonMapperCtx} from "../interfaces/JsonMapperMethods.js";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer.js";
import {JsonSerializer} from "./JsonSerializer.js";

class Code {}

class Item {
  @Property()
  count: number;

  @Property()
  label: string;

  @Property()
  at: Date;

  @Property()
  code: Code;
}

function item() {
  return Object.assign(new Item(), {count: 1, label: "a", at: new Date("2022-10-02T00:00:00.000Z"), code: "C1"});
}

describe("JsonSerializer type mappers", () => {
  it("should use a mapper replaced in the types between two calls", () => {
    const serializer = new JsonSerializer();
    const types = new Map<any, any>(getJsonMapperTypes());

    expect(serializer.map(item(), {types}).at).toEqual("2022-10-02T00:00:00.000Z");

    types.set(Date, {serialize: (date: Date) => date.getTime(), deserialize: (value: any) => value});

    expect(serializer.map(item(), {types}).at).toEqual(1664668800000);
  });

  it("should register a type mapper again once it was removed or replaced", () => {
    const serializer = new JsonSerializer();

    expect(serializer.map(item())).toEqual({count: 1, label: "a", at: "2022-10-02T00:00:00.000Z", code: "C1"});

    serializer.removeTypeMapper(Number);
    serializer.addTypeMapper(String, () => "replaced");

    expect(serializer.map(item())).toEqual({count: 1, label: "a", at: "2022-10-02T00:00:00.000Z", code: "C1"});
  });

  it("should give the context to a subclass of PrimitiveMapper", () => {
    class TypedNumberMapper extends PrimitiveMapper {
      protected Number(data: any, ctx?: JsonMapperCtx) {
        return `${nameOf(ctx?.type)}:${data}`;
      }
    }

    const types = new Map<any, any>(getJsonMapperTypes());
    types.set(Number, new TypedNumberMapper());

    expect(new JsonSerializer().map(item(), {types}).count).toEqual("Number:1");
  });

  it("should keep the value as is for a PrimitiveMapper on a type it has no conversion for", () => {
    const types = new Map<any, any>(getJsonMapperTypes());
    types.set(Code, new PrimitiveMapper());

    expect(new JsonSerializer().map(item(), {types}).code).toEqual("C1");
  });
});
