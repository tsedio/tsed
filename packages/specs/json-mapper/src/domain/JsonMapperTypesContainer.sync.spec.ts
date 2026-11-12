import {Property} from "@tsed/schema";

import {JsonDeserializer} from "./JsonDeserializer.js";
import {getJsonMapperTypes, JsonMapperTypesMap} from "./JsonMapperTypesContainer.js";
import {JsonSerializer} from "./JsonSerializer.js";

class Money {
  constructor(public amount: number) {}
}

class Order {
  @Property()
  total: Money;
}

const types = getJsonMapperTypes();

function mapper(prefix: string) {
  return {
    serialize: (value: Money) => `${prefix}${value.amount}`,
    deserialize: (value: string) => new Money(Number(String(value).replace(/\D/g, "")) + (prefix === "B" ? 1000 : 0))
  };
}

describe("type mappers of the global registry", () => {
  afterEach(() => {
    types.delete(Money);
  });

  it("should count the changes of the registry", () => {
    const registry = new JsonMapperTypesMap<any, any>();

    registry.set("a", 1);
    registry.delete("missing");
    registry.delete("a");
    registry.clear();

    expect(registry.version).toEqual(3);
  });

  it("should use a mapper registered after the first call that maps its type", () => {
    const serializer = new JsonSerializer();

    expect(serializer.map(new Money(5), {type: Money})).toEqual({amount: 5});

    types.set(Money, mapper("A"));

    expect(serializer.map(new Money(5), {type: Money})).toEqual("A5");
  });

  it("should use the mapper that replaced the former one", () => {
    const deserializer = new JsonDeserializer();
    types.set(Money, mapper("A"));

    expect(deserializer.map({total: "5"}, {type: Order}).total).toEqual(new Money(5));

    types.set(Money, mapper("B"));

    expect(deserializer.map({total: "5"}, {type: Order}).total).toEqual(new Money(1005));
  });

  it("should follow a method of a registered mapper replaced in place", () => {
    const serializer = new JsonSerializer();
    const instance: any = mapper("A");
    types.set(Money, instance);

    expect(serializer.map(Object.assign(new Order(), {total: new Money(5)}), {type: Order})).toEqual({total: "A5"});

    instance.serialize = (value: Money) => `C${value.amount}`;

    expect(serializer.map(Object.assign(new Order(), {total: new Money(5)}), {type: Order})).toEqual({total: "C5"});
  });

  it("should use the mappers of an explicit types option for that call", () => {
    const serializer = new JsonSerializer();
    const custom = new Map<any, any>(types).set(Money, mapper("X"));

    expect(serializer.map(Object.assign(new Order(), {total: new Money(5)}), {type: Order, types: custom})).toEqual({total: "X5"});
  });
});
