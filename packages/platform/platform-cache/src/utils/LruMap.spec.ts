import {Keyv} from "keyv";
import {LruMap} from "./LruMap.js";

describe("LruMap", () => {
  it("should evict the least recently used entry", () => {
    const map = new LruMap<string, number>(2);

    map.set("a", 1);
    map.set("b", 2);
    map.get("a");
    map.set("c", 3);

    expect([...map.keys()]).toEqual(["a", "c"]);
  });

  it("should not evict when updating an existing key", () => {
    const map = new LruMap<string, number>(2);

    map.set("a", 1);
    map.set("b", 2);
    map.set("a", 3);

    expect([...map.entries()]).toEqual([
      ["b", 2],
      ["a", 3]
    ]);
  });

  it("should return undefined for a missing key", () => {
    expect(new LruMap(1).get("a")).toBeUndefined();
  });

  it("should not bound the map when max is 0", () => {
    const map = new LruMap<string, number>(0);

    map.set("a", 1);
    map.set("b", 2);

    expect(map.size).toEqual(2);
  });

  it("should be iterable by Keyv", async () => {
    const keyv = new Keyv({store: new LruMap(10)});

    await keyv.set("a", 1);
    await keyv.set("b", 2);

    const keys = [];

    for await (const [key] of keyv.iterator!(undefined)) {
      keys.push(key);
    }

    expect(keys).toEqual(["a", "b"]);
  });
});
