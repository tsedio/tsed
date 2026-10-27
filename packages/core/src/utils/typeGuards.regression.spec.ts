import {isClass} from "./isClass.js";
import {isPrimitive, isPrimitiveOrPrimitiveClass} from "./isPrimitive.js";
import {isTemporal} from "./isTemporal.js";

class Model {}

function fn() {}

const VALUES: [string, () => any][] = [
  ["undefined", () => undefined],
  ["null", () => null],
  ["empty string", () => ""],
  ["string", () => "text"],
  ["0", () => 0],
  ["number", () => 42],
  ["NaN", () => NaN],
  ["false", () => false],
  ["true", () => true],
  ["symbol", () => Symbol("s")],
  ["bigint", () => BigInt(1)],
  ["new String", () => new String("a")],
  ["new Number", () => new Number(1)],
  ["new Boolean", () => new Boolean(false)],
  ["String", () => String],
  ["Number", () => Number],
  ["Boolean", () => Boolean],
  ["Symbol", () => Symbol],
  ["Object", () => Object],
  ["Array", () => Array],
  ["Map", () => Map],
  ["Date", () => Date],
  ["Promise", () => Promise],
  ["Buffer", () => Buffer],
  ["Uint8Array", () => Uint8Array],
  ["class", () => Model],
  ["function", () => fn],
  ["arrow function", () => () => {}],
  ["plain object", () => ({a: 1})],
  ["Object.create(null)", () => Object.create(null)],
  ["instance", () => new Model()],
  ["array", () => [1, 2]],
  ["map", () => new Map()],
  ["date", () => new Date("2024-01-01")],
  ["invalid date", () => new Date("x")],
  ["promise", () => Promise.resolve()],
  ["thenable", () => ({then() {}})],
  ["buffer", () => Buffer.from("a")],
  ["uint8array", () => new Uint8Array(1)],
  ["Temporal.PlainDate", () => Temporal.PlainDate],
  ["Temporal.Duration", () => Temporal.Duration],
  ["plain date", () => Temporal.PlainDate.from("2024-01-15")],
  ["instant", () => Temporal.Instant.from("2024-01-15T10:30:00Z")]
];

function run(guard: (value: any) => boolean) {
  return Object.fromEntries(
    VALUES.map(([name, value]) => {
      try {
        return [name, guard(value())];
      } catch (er) {
        return [name, `throws ${(er as Error).constructor.name}`];
      }
    })
  );
}

describe("type guards (non-regression)", () => {
  it("isPrimitive", () => {
    expect(run(isPrimitive)).toMatchSnapshot();
  });

  it("isPrimitiveOrPrimitiveClass", () => {
    expect(run(isPrimitiveOrPrimitiveClass)).toMatchSnapshot();
  });

  it("isClass", () => {
    expect(run(isClass)).toMatchSnapshot();
  });

  it("isTemporal", () => {
    expect(run(isTemporal)).toMatchSnapshot();
  });

  it("isTemporal should follow a replaced global Temporal", () => {
    const original = globalThis.Temporal;
    const instant = Temporal.Instant.from("2024-01-15T10:30:00Z");

    class FakeInstant {}

    try {
      expect(isTemporal(instant)).toBe(true);

      (globalThis as any).Temporal = {Instant: FakeInstant};
      expect(isTemporal(instant)).toBe(false);
      expect(isTemporal(new FakeInstant())).toBe(true);
      expect(isTemporal(FakeInstant)).toBe(true);

      (globalThis as any).Temporal = undefined;
      expect(isTemporal(new FakeInstant())).toBe(false);
    } finally {
      (globalThis as any).Temporal = original;
    }

    expect(isTemporal(instant)).toBe(true);
  });
});
