import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {CollectionOf, Name, Property} from "@tsed/schema";

import {JsonSerializer} from "./JsonSerializer.js";

const at = new Date("2022-10-02T00:00:00.000Z");

class Customer {
  @Name("customer_name")
  name: string;
}

class Line {
  @Property()
  label: string;

  @Property()
  at: Date;

  @Property()
  meta: any;
}

class Order {
  @CollectionOf(String)
  tags: string[];

  @CollectionOf(Line)
  lines: Line[];

  @CollectionOf(Line)
  linesSet: Set<Line>;

  @CollectionOf(Line)
  linesMap: Map<string, Line>;

  @Property()
  meta: any;
}

function line(label: string) {
  return Object.assign(new Line(), {label, at});
}

function customer(name: string) {
  return Object.assign(new Customer(), {name});
}

describe("JsonSerializer collections and plain objects", () => {
  let serializer: JsonSerializer;

  beforeEach(() => {
    serializer = new JsonSerializer();
  });

  describe("Array", () => {
    it("should keep the holes of a sparse array without calling the item mapper", () => {
      const tags = ["a", , "b"];

      const result = serializer.map(Object.assign(new Order(), {tags}));

      expect(result.tags).toHaveLength(3);
      expect(1 in result.tags).toBe(false);
      expect(JSON.stringify(result.tags)).toBe('["a",null,"b"]');
    });

    it("should map a single value given to an array property as a one-item array", () => {
      const result = serializer.map(Object.assign(new Order(), {tags: "a", lines: line("l1")}));

      expect(result).toEqual({tags: ["a"], lines: [{label: "l1", at: at.toISOString()}]});
    });

    it("should map every item of an array of models", () => {
      const result = serializer.map(Object.assign(new Order(), {lines: [line("l1"), line("l2"), null]}));

      expect(result).toEqual({
        lines: [{label: "l1", at: at.toISOString()}, {label: "l2", at: at.toISOString()}, null]
      });
    });

    it("should not give the item mapper id to the values of an untyped object", () => {
      const result = serializer.map(
        Object.assign(new Order(), {lines: [Object.assign(line("l1"), {meta: {customers: [customer("john")], at}})]})
      );

      expect(result).toEqual({
        lines: [{label: "l1", at: at.toISOString(), meta: {customers: [{customer_name: "john"}], at: at.toISOString()}}]
      });
    });

    it("should return a plain array for an Array subclass, also from the cached type", () => {
      class LineList extends Array {}

      const list = new LineList();
      list.push(line("l1"), {label: "plain", tags: ["x"]});

      for (let i = 0; i < 2; i++) {
        const result = serializer.map(list);

        expect(Array.isArray(result)).toBe(true);
        expect(result.constructor).toBe(Array);
        expect(result).toEqual([
          {label: "l1", at: at.toISOString()},
          {label: "plain", tags: ["x"]}
        ]);
      }
    });
  });

  describe("Set and Map", () => {
    it("should map Set and Map properties of models", () => {
      const result = serializer.map(
        Object.assign(new Order(), {
          linesSet: new Set([line("l1"), line("l2")]),
          linesMap: new Map([
            ["a", line("l1")],
            ["b", line("l2")]
          ])
        })
      );

      expect(result).toEqual({
        linesSet: [
          {label: "l1", at: at.toISOString()},
          {label: "l2", at: at.toISOString()}
        ],
        linesMap: {
          a: {label: "l1", at: at.toISOString()},
          b: {label: "l2", at: at.toISOString()}
        }
      });
    });

    it("should map Set and Map without schema", () => {
      const set = new Set<any>([1, "a", at, {tags: ["x"]}]);
      const map = new Map<string, any>([
        ["date", at],
        ["nested", {list: [1, 2], sub: new Map([["k", "v"]])}]
      ]);

      expect(serializer.map(set)).toEqual([1, "a", at.toISOString(), {tags: ["x"]}]);
      expect(serializer.map(map)).toEqual({date: at.toISOString(), nested: {list: [1, 2], sub: {k: "v"}}});
    });
  });

  describe("plain objects", () => {
    it("should map a nested plain object containing arrays", () => {
      const result = serializer.map(
        Object.assign(new Order(), {
          meta: {
            labels: ["a", "b"],
            nested: {lines: [line("l1")], when: at, empty: null}
          }
        })
      );

      expect(result).toEqual({
        meta: {
          labels: ["a", "b"],
          nested: {lines: [{label: "l1", at: at.toISOString()}], when: at.toISOString(), empty: null}
        }
      });
    });

    it("should map plain objects nested in an array of any", () => {
      const result = serializer.map([{list: [{deep: [at]}]}, {other: new Set(["s"])}]);

      expect(result).toEqual([{list: [{deep: [at.toISOString()]}]}, {other: ["s"]}]);
    });

    it("should keep own enumerable values only and skip functions and undefined", () => {
      const input = Object.create({inherited: "no"});
      input.own = "yes";
      input.empty = null;
      input.missing = undefined;
      input.method = () => "no";
      Object.defineProperty(input, "hidden", {value: "no", enumerable: false});

      const result = serializer.map({value: input});

      expect(result).toEqual({value: {own: "yes", empty: null}});
      expect(Object.keys(result.value)).toEqual(["own", "empty"]);
    });
  });

  describe("__proto__ key", () => {
    it("should keep an own __proto__ key of a plain object as a key", () => {
      const input = JSON.parse('{"__proto__": {"polluted": true}, "b": 2}');

      const result = serializer.map({value: input}).value;

      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(Object.keys(result)).toEqual(["__proto__", "b"]);
      expect(result.polluted).toBeUndefined();
      expect(JSON.stringify(result)).toBe('{"__proto__":{"polluted":true},"b":2}');
    });

    it("should keep a __proto__ key of a Map as a key", () => {
      const input = new Map<string, any>([
        ["__proto__", {polluted: true}],
        ["b", 2]
      ]);

      const result = serializer.map(input);

      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(Object.keys(result)).toEqual(["__proto__", "b"]);
      expect(result.polluted).toBeUndefined();
      expect(JSON.stringify(result)).toBe('{"__proto__":{"polluted":true},"b":2}');
    });
  });
});
