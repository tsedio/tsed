import "../components/PrimitiveMapper.js";

import {Property} from "@tsed/schema";

import {serialize} from "./serialize.js";

describe("serialize()", () => {
  it("should serialize values", () => {
    expect(serialize(undefined)).toBeUndefined();
    expect(serialize(null)).toEqual(null);
    expect(serialize("null")).toEqual("null");
    expect(serialize(Symbol.for("TEST"))).toEqual("TEST");
    expect(serialize(false)).toEqual(false);
    expect(serialize(true)).toEqual(true);
    expect(serialize("")).toEqual("");
    expect(serialize("1")).toEqual("1");
    expect(serialize(0)).toEqual(0);
    expect(serialize(1)).toEqual(1);
    expect(serialize(BigInt(1n))).toEqual(BigInt(1));

    class Entity {
      @Property()
      num: number;
    }

    expect(
      serialize(
        {
          num: "1"
        },
        {type: Entity}
      )
    ).toEqual({
      num: 1
    });
  });
});
