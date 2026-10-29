import {toMap} from "./toMap.js";

describe("toMap", () => {
  describe("from Object", () => {
    it("should create map", () => {
      const result = toMap({
        test: {top: "test"},
        test1: {top: "test1"}
      });

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect([...result.keys()]).toEqual(["test", "test1"]);
      expect([...result.values()]).toEqual([{top: "test"}, {top: "test1"}]);
    });
    it("should create map by id", () => {
      const result = toMap(
        {
          test: {id: "1", top: "test"},
          test1: {id: "2", top: "test1"},
          test3: {id: "1", top: "test"}
        },
        "id"
      );

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect([...result.keys()]).toEqual(["1", "2"]);
      expect([...result.values()]).toEqual([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
    it("should create map by fn id", () => {
      const result = toMap(
        {
          test: {id: "1", top: "test"},
          test1: {id: "2", top: "test1"},
          test3: {id: "1", top: "test"}
        },
        (item) => item.id
      );

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect([...result.keys()]).toEqual(["1", "2"]);
      expect([...result.values()]).toEqual([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
  });
  describe("from Array", () => {
    it("should create map", () => {
      const result = toMap([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        },
        {
          id: "1",
          top: "test"
        }
      ]);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect([...result.keys()]).toEqual(["1", "2"]);
      expect([...result.values()]).toEqual([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
    it("should create map by id", () => {
      const result = toMap(
        [
          {
            id: "1",
            top: "test"
          },
          {
            id: "2",
            top: "test1"
          },
          {
            id: "1",
            top: "test"
          }
        ],
        "id"
      );

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect([...result.keys()]).toEqual(["1", "2"]);
      expect([...result.values()]).toEqual([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
    it("should create map by fn id", () => {
      const result = toMap(
        [
          {
            id: "1",
            top: "test"
          },
          {
            id: "2",
            top: "test1"
          },
          {
            id: "1",
            top: "test"
          }
        ],
        (item) => item.id
      );

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect([...result.keys()]).toEqual(["1", "2"]);
      expect([...result.values()]).toEqual([
        {
          id: "1",
          top: "test"
        },
        {
          id: "2",
          top: "test1"
        }
      ]);
    });
    it("should create map by fn id + merge", () => {
      class Data {
        id: string;
        count: string;

        constructor(opts: any) {
          this.id = opts.id;
          this.count = opts.count;
        }

        merge(d: Data) {
          this.count += d.count;
          return this;
        }
      }

      const result = toMap(
        [
          new Data({
            id: "1",
            count: 5
          }),
          new Data({
            id: "2",
            count: 5
          }),
          new Data({
            id: "1",
            count: 10
          })
        ],
        (item) => item.id
      );

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect([...result.keys()]).toEqual(["1", "2"]);
      expect([...result.values()]).toEqual([
        {
          count: 15,
          id: "1"
        },
        {
          count: 5,
          id: "2"
        }
      ]);
    });
  });

  describe("edge cases", () => {
    it("should skip the holes of a sparse array", () => {
      // eslint-disable-next-line no-sparse-arrays
      const map = toMap([{id: "a"}, , {id: "b"}] as any[]);

      expect([...map.keys()]).toEqual(["a", "b"]);
    });

    it("should register an item under each id returned by the identity", () => {
      const item = {id: "a"};
      const map = toMap<string, any>([item], (value: any) => [value.id, "alias"]);

      expect(map.get("a")).toBe(item);
      expect(map.get("alias")).toBe(item);
    });

    it("should skip the holes of the ids returned by the identity", () => {
      const item = {id: "a"};
      const existing = {id: "undefined"};
      const ids: string[] = [];
      ids[0] = "a";
      ids[2] = "b";

      const map = toMap<any, any>([existing, item], (value: any) => (value === item ? ids : (undefined as any)));

      expect([...map.keys()]).toEqual([undefined, "a", "b"]);
      expect(map.get(undefined)).toBe(existing);
      expect(map.get("b")).toBe(item);
    });

    it("should merge the items sharing an id", () => {
      const first = {
        id: "a",
        values: [1],
        merge(other: any) {
          return {...this, values: [...this.values, ...other.values]};
        }
      };
      const map = toMap<string, any>([first, {id: "a", values: [2]}]);

      expect(map.get("a").values).toEqual([1, 2]);
    });

    it("should chain the merged value across the ids of one item", () => {
      const existing = {
        merge(other: any) {
          return {merged: other};
        }
      };
      const seed = {id: "x"};
      const map = toMap<string, any>([existing, seed], (value: any, index) => (index === 0 ? "a" : ["a", "b"]));

      expect(map.get("a")).toEqual({merged: seed});
      expect(map.get("b")).toEqual({merged: seed});
    });

    it("should use the record keys and own enumerable keys only", () => {
      const record = Object.create({inherited: 1});
      record.b = 2;
      record.a = 1;

      expect([...toMap(record).entries()]).toEqual([
        ["b", 2],
        ["a", 1]
      ]);
    });
  });
});
