import {JsonSchema} from "../domain/JsonSchema.js";
import {s} from "./index.js";

// Helper classes for from() and lazyRef()
class UserClass {
  id!: string;
}

describe("Functional API typing (inference)", () => {
  it("should infer primitives", () => {
    const str = s.string();
    const num = s.number();
    const int = s.integer();
    const bool = s.boolean();

    type S = s.infer<typeof str>;
    type N = s.infer<typeof num>;
    type I = s.infer<typeof int>;
    type B = s.infer<typeof bool>;

    expectTypeOf<S>().toEqualTypeOf<string>();
    expectTypeOf<N>().toEqualTypeOf<number>();
    expectTypeOf<I>().toEqualTypeOf<number>();
    expectTypeOf<B>().toEqualTypeOf<boolean>();

    // also ensure runtime still returns JsonSchema
    expect(str).toBeInstanceOf(JsonSchema);
    expect(num).toBeInstanceOf(JsonSchema);
    expect(int).toBeInstanceOf(JsonSchema);
    expect(bool).toBeInstanceOf(JsonSchema);
  });
  it("should infer dates as Date by default", () => {
    const d = s.date();
    const dt = s.datetime();
    const t = s.time();

    type D = s.infer<typeof d>;
    type DT = s.infer<typeof dt>;
    type T = s.infer<typeof t>;

    expectTypeOf<D>().toEqualTypeOf<Date>();
    expectTypeOf<DT>().toEqualTypeOf<Date>();
    expectTypeOf<T>().toEqualTypeOf<Date>();
  });
  it("should infer from() ctor mapping", () => {
    const fromString = s.from(String);
    const fromNumber = s.from(Number);
    const fromBoolean = s.from(Boolean);
    const fromDate = s.from(Date);
    const fromArray = s.from(Array);
    const fromMap = s.from(Map);
    const fromSet = s.from(Set);
    const fromObj = s.from();

    type FS = s.infer<typeof fromString>;
    type FN = s.infer<typeof fromNumber>;
    type FB = s.infer<typeof fromBoolean>;
    type FD = s.infer<typeof fromDate>;
    type FA = s.infer<typeof fromArray>;
    type FM = s.infer<typeof fromMap>;
    type FSe = s.infer<typeof fromSet>;
    type FO = s.infer<typeof fromObj>;

    expectTypeOf<FS>().toEqualTypeOf<string>();
    expectTypeOf<FN>().toEqualTypeOf<number>();
    expectTypeOf<FB>().toEqualTypeOf<boolean>();
    expectTypeOf<FD>().toEqualTypeOf<Date>();
    expectTypeOf<FA>().toEqualTypeOf<any[]>();
    expectTypeOf<FM>().toEqualTypeOf<Record<string, any>>();
    expectTypeOf<FSe>().toEqualTypeOf<Set<any>>();
    expectTypeOf<FO>().toEqualTypeOf<Record<string, any>>();
  });
  it("should type chainers: optional / nullable / default / required", () => {
    const base = s.string();
    const opt = base.optional();
    const nul = base.nullable();
    const reqNul = base.required().nullable();
    const def = base.default("");
    const req = base.optional().required();

    type Base = s.infer<typeof base>;
    type Opt = s.infer<typeof opt>;
    type Nul = s.infer<typeof nul>;
    type ReqNul = s.infer<typeof reqNul>;
    type Def = s.infer<typeof def>;
    type Req = s.infer<typeof req>;

    expectTypeOf<Base>().toEqualTypeOf<string>();
    expectTypeOf<Opt>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Nul>().toEqualTypeOf<string | null>();
    expectTypeOf<ReqNul>().toEqualTypeOf<string | null>();
    expectTypeOf<Def>().toEqualTypeOf<string>(); // documentation-only, no type impact
    expectTypeOf<Req>().toEqualTypeOf<string>();
  });
  it("should infer collections: array / set / map", () => {
    const arr = s.array(s.number());
    const set = s.set(s.string());
    const map = s.map(s.boolean());

    type A = s.infer<typeof arr>;
    type Se = s.infer<typeof set>;
    type M = s.infer<typeof map>;

    expectTypeOf<A>().toEqualTypeOf<number[]>();
    expectTypeOf<Se>().toEqualTypeOf<Set<string>>();
    expectTypeOf<M>().toEqualTypeOf<Map<string, boolean>>();

    // @ts-ignore
    s.array(123);
  });
  it("should infer collections: array / set / map (long syntax)", () => {
    const arr = s.array().items(s.number());
    const set = s.set().items(s.string());
    const map = s.map().additionalProperties(s.boolean());

    type A = s.infer<typeof arr>;
    type Se = s.infer<typeof set>;
    type M = s.infer<typeof map>;

    expectTypeOf<A>().toEqualTypeOf<number[]>();
    expectTypeOf<Se>().toEqualTypeOf<Set<string>>();
    expectTypeOf<M>().toEqualTypeOf<Map<string, boolean>>();

    // @ts-ignore
    s.array(123);
  });
  it("should infer object(props)", () => {
    const UserSchema = s.object({
      id: s.string().required(),
      email: s.string().optional(),
      age: s.number().optional().nullable(),
      roles: s.array(s.string()).default([]),
      profile: s.object({
        firstName: s.string(),
        lastName: s.string().optional()
      })
    });

    type User = s.infer<typeof UserSchema>;

    expectTypeOf<User>().toEqualTypeOf<{
      id: string;
      email: string | undefined;
      age: number | null | undefined;
      roles: string[];
      profile: {firstName: string; lastName: string | undefined};
    }>();
  });
  it("should infer object().properties()", () => {
    const UserSchema = s.object().properties({
      id: s.string().required(),
      email: s.string().optional(),
      age: s.number().optional().nullable(),
      roles: s.array(s.string()).default([]),
      profile: s.object({
        firstName: s.string(),
        lastName: s.string().optional()
      })
    });

    type User = s.infer<typeof UserSchema>;

    expectTypeOf<User>().toEqualTypeOf<{
      id: string;
      email: string | undefined;
      age: number | null | undefined;
      roles: string[];
      profile: {firstName: string; lastName: string | undefined};
    }>();
  });
  it("should infer object().unknown()", () => {
    const UserSchema = s
      .object({
        id: s.string().required()
      })
      .unknown();

    type User = s.infer<typeof UserSchema>;
    expectTypeOf<User>().toEqualTypeOf<{id: string} & Record<string, unknown>>();
  });
  it("should infer enums from literals and enum-like objects", () => {
    const literalEnum = s.enums(["A", "B", "C"] as const);
    type LE = s.infer<typeof literalEnum>;

    expectTypeOf<LE>().toEqualTypeOf<"A" | "B" | "C">();

    const obj = {X: "x", Y: "y"} as const;
    const objectEnum = s.enums(obj);
    type OE = s.infer<typeof objectEnum>;

    expectTypeOf<OE>().toEqualTypeOf<(typeof obj)[keyof typeof obj]>();

    enum N {
      A = 1,
      B = 2
    }

    const tsEnum = s.enums(N);
    type NE = s.infer<typeof tsEnum>;
    expectTypeOf<NE>().toEqualTypeOf<N>();
  });
  it("should infer string.enum()", () => {
    const schema = s.string().enum("a", "b", "c");

    type E = s.infer<typeof schema>;

    expectTypeOf<E>().toEqualTypeOf<"a" | "b" | "c">();

    const obj = {X: "x", Y: "y"} as const;
    const objectEnum = s.string().enum(obj);
    type OE = s.infer<typeof objectEnum>;

    expectTypeOf<OE>().toEqualTypeOf<(typeof obj)[keyof typeof obj]>();

    enum N {
      A = 1,
      B = 2
    }

    const tsEnum = s.string().enum(N);
    type NE = s.infer<typeof tsEnum>;
    expectTypeOf<NE>().toEqualTypeOf<N>();
  });
  it("should infer number.enum()", () => {
    const schema = s.number().enum(1, 2, 3);

    type E = s.infer<typeof schema>;
    expectTypeOf<E>().toEqualTypeOf<1 | 2 | 3>();
  });
  it("should trigger error when value of a enum isn't aligned with base type", () => {
    // @ts-expect-error - mixed types not allowed
    s.string().enum("a", "b", 3);
  });
  it("should infer unions and intersections (oneOf/anyOf/allOf)", () => {
    const u1 = s.oneOf(s.string(), s.number());
    type U1 = s.infer<typeof u1>;
    expectTypeOf<U1>().toEqualTypeOf<string | number>();

    const u2 = s.anyOf(s.boolean(), s.integer());
    type U2 = s.infer<typeof u2>;
    expectTypeOf<U2>().toEqualTypeOf<boolean | number>();

    const i1 = s.allOf(s.object({a: s.string()}), s.object({b: s.number()}));
    type I1 = s.infer<typeof i1>;
    expectTypeOf<I1>().toEqualTypeOf<{a: string} & {b: number}>();
  });
  it("should infer lazyRef to InstanceType", () => {
    const ref = s.lazyRef(() => UserClass);
    type R = s.infer<typeof ref>;
    expectTypeOf<R>().toEqualTypeOf<UserClass>();
  });
  it("should allow nested compositions", () => {
    const Schema = s.object({
      ids: s.set(s.string()).optional(),
      flags: s.map(s.boolean()).nullable(),
      matrix: s.array(s.array(s.number()))
    });

    type T = s.infer<typeof Schema>;
    // @ts-expect-error - ids is optional, flags is nullable
    expectTypeOf<T>().toEqualTypeOf<{
      ids?: Set<string> | undefined;
      flags: Record<string, boolean> | null;
      matrix: number[][];
    }>();
  });
  it("should infer any() with and without arguments", () => {
    const a0 = s.any();
    type A0 = s.infer<typeof a0>;
    expectTypeOf<A0>().toEqualTypeOf<any>();

    const a1 = s.any(s.string());
    type A1 = s.infer<typeof a1>;
    expectTypeOf<A1>().toEqualTypeOf<[string]>();

    const a2 = s.any(s.string(), s.number(), s.boolean());
    type A2 = s.infer<typeof a2>;

    expectTypeOf<A2>().toEqualTypeOf<[string, number, boolean]>();
  });
  it("should infer .const()", () => {
    const c1 = s.string().const("fixedValue");

    type C1 = s.infer<typeof c1>;

    expectTypeOf<C1>().toEqualTypeOf<"fixedValue">();
  });
  it("should infer record() as Record<string, V>", () => {
    const r1 = s.record();
    const r2 = s.record(s.string());
    const r3 = s.record(s.number());

    type R1 = s.infer<typeof r1>;
    type R2 = s.infer<typeof r2>;
    type R3 = s.infer<typeof r3>;

    expectTypeOf<R1>().toEqualTypeOf<Record<string, any>>();
    expectTypeOf<R2>().toEqualTypeOf<Record<string, string>>();
    expectTypeOf<R3>().toEqualTypeOf<Record<string, number>>();
  });
});
