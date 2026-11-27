import "../components/PrimitiveMapper.js";
import "../components/DateMapper.js";
import "../components/TemporalMapper.js";

import {deserialize} from "./deserialize.js";
import {serialize} from "./serialize.js";

// Impact of isBoolean()/isPrimitive() on @tsed/json-mapper, for the Boolean constructor and boxed
// booleans (primitives as a baseline).
const INPUTS: Record<string, () => any> = {
  true: () => true,
  false: () => false,
  Boolean: () => Boolean,
  "new Boolean(true)": () => new Boolean(true),
  "new Boolean(false)": () => new Boolean(false)
};

function describeValue(value: any): string {
  if (value === Boolean) {
    return "Boolean constructor";
  }

  if (value instanceof Boolean) {
    try {
      return `Boolean object, valueOf() = ${value.valueOf()}`;
    } catch (er) {
      return `Boolean-like object, valueOf() throws ${(er as Error).constructor.name}`;
    }
  }

  if (value instanceof Date) {
    return `Date ${isNaN(+value) ? "Invalid Date" : value.toISOString()}`;
  }

  if (value && typeof value === "object") {
    return `${value.constructor?.name} ${JSON.stringify(value)}`;
  }

  return `${typeof value} ${String(value)}`;
}

function table(scenario: (value: any) => any) {
  return Object.fromEntries(
    Object.entries(INPUTS).map(([name, value]) => {
      try {
        return [name, describeValue(scenario(value()))];
      } catch (er) {
        return [name, `throws ${(er as Error).constructor.name}`];
      }
    })
  );
}

describe("isBoolean/isPrimitive impact on @tsed/json-mapper", () => {
  it("serialize(value)", () => {
    expect(table((value) => serialize(value))).toMatchSnapshot();
  });

  it("serialize({flag: value}).flag", () => {
    expect(table((value) => serialize({flag: value}).flag)).toMatchSnapshot();
  });

  it("deserialize(value, {type: Date}) (DateMapper)", () => {
    expect(table((value) => deserialize(value, {type: Date}))).toMatchSnapshot();
  });

  it("deserialize(value, {type: Temporal.Instant}) (TemporalMapper)", () => {
    expect(table((value) => deserialize(value, {type: Temporal.Instant}))).toMatchSnapshot();
  });
});
