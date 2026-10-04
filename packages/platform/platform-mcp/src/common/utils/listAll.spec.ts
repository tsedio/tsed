import {listAll} from "./listAll.js";

describe("listAll()", () => {
  it("returns nothing without calling the upstream when the capability is missing", async () => {
    const list = vi.fn();

    await expect(listAll(undefined, list, "tools")).resolves.toEqual([]);
    expect(list).not.toHaveBeenCalled();
  });

  it("returns the items of a single page", async () => {
    const list = vi.fn().mockResolvedValue({tools: [{name: "a"}, {name: "b"}]});

    await expect(listAll({}, list, "tools")).resolves.toEqual([{name: "a"}, {name: "b"}]);
    expect(list).toHaveBeenCalledExactlyOnceWith({});
  });

  it("follows the cursor until the last page", async () => {
    const list = vi
      .fn()
      .mockResolvedValueOnce({resources: [{uri: "a"}], nextCursor: "page-2"})
      .mockResolvedValueOnce({resources: [{uri: "b"}], nextCursor: "page-3"})
      .mockResolvedValueOnce({resources: [{uri: "c"}]});

    await expect(listAll(true, list, "resources")).resolves.toEqual([{uri: "a"}, {uri: "b"}, {uri: "c"}]);
    expect(list.mock.calls).toEqual([[{}], [{cursor: "page-2"}], [{cursor: "page-3"}]]);
  });
});
