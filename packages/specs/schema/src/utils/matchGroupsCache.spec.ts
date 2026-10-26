import {matchGroups} from "./matchGroups.js";

describe("matchGroups() with cached patterns", () => {
  const groupsList = [
    [],
    ["read"],
    ["!creation"],
    ["read", "!creation"],
    ["!creation", "!update"],
    ["group.*"],
    ["!group.*"],
    ["details", "group.summary"]
  ];
  const compareWithList = [
    [],
    ["read"],
    ["creation"],
    ["group.summary"],
    ["group.*"],
    ["!creation"],
    ["read", "creation"],
    ["details", "!read"]
  ];

  it("should give the same results on the first and on the next calls", () => {
    const run = () => groupsList.map((groups) => compareWithList.map((compareWith) => matchGroups(groups, compareWith)));

    const first = run();

    expect(run()).toEqual(first);
    expect(first).toMatchSnapshot();
  });

  it("should still throw for an empty pattern", () => {
    expect(() => matchGroups(["read"], [""])).toThrow();
    expect(() => matchGroups(["read"], [""])).toThrow();
  });
});
