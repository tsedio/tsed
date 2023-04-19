import {toMap} from "./toMap";

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
});
