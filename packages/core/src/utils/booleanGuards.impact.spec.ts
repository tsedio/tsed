import {deepClone} from "./deepClone.js";
import {deepMerge} from "./deepMerge.js";
import {isSerializable} from "./isSerializable.js";

// Impact of isBoolean()/isPrimitive() on their @tsed/core callers, for the values the guards could
// treat differently: the Boolean constructor and boxed booleans (primitives as a baseline).
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

  return `${typeof value} ${String(value)}`;
}

function observe(fn: () => any) {
  try {
    return describeValue(fn());
  } catch (er) {
    return `throws ${(er as Error).constructor.name}`;
  }
}

function table(scenario: (value: any) => any) {
  return Object.fromEntries(Object.entries(INPUTS).map(([name, value]) => [name, observe(() => scenario(value()))]));
}

describe("isBoolean/isPrimitive impact on @tsed/core callers", () => {
  it("isSerializable(value)", () => {
    expect(table((value) => isSerializable(value))).toMatchSnapshot();
  });

  it("deepClone(value)", () => {
    expect(table((value) => deepClone(value))).toMatchSnapshot();
  });

  it("deepClone({flag: value}).flag", () => {
    expect(table((value) => deepClone({flag: value}).flag)).toMatchSnapshot();
  });

  it("deepMerge({flag: value}, {other: 1}).flag", () => {
    expect(table((value) => deepMerge({flag: value}, {other: 1})!.flag)).toMatchSnapshot();
  });

  it("deepMerge({flag: true}, {flag: value}).flag", () => {
    expect(table((value) => deepMerge({flag: true}, {flag: value})!.flag)).toMatchSnapshot();
  });
});
