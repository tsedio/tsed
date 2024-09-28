import {Enum, Property, Required} from "@tsed/schema";

import {serialize} from "../../src/utils/serialize.js";

export enum EnumValue {
  One = "one",
  Two = "two"
}

export class NestedEnum {
  @Required()
  @Enum(EnumValue)
  value: EnumValue;
}

export class TestNestedEnum {
  @Property()
  nested: NestedEnum;
}

describe("enum serialization", () => {
  it("should serialize enum and nested enum", () => {
    const test = new TestNestedEnum();
    const nested = new NestedEnum();
    nested.value = EnumValue.One;
    test.nested = nested;

    expect(serialize(test)).toEqual({nested: {value: "one"}});
  });
});
