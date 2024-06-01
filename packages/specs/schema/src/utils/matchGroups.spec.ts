import {matchGroups} from "./matchGroups.js";

describe("matchGroups", () => {
  it.each([
    [
      {
        groups: ["!creation"],
        givenGroups: [],
        expected: false
      },
      {
        groups: ["group.summary"],
        givenGroups: [],
        expected: true
      },
      {
        groups: ["group.extended"],
        givenGroups: [],
        expected: true
      },
      {
        groups: ["!creation"],
        givenGroups: [],
        expected: false
      },
      {
        groups: ["group.summary"],
        givenGroups: [],
        expected: true
      },
      {
        groups: ["group.extended"],
        givenGroups: [],
        expected: true
      },
      {
        groups: ["!creation"],
        givenGroups: ["group.summary"],
        expected: false
      },
      {
        groups: ["group.summary"],
        givenGroups: ["group.summary"],
        expected: false
      },
      {
        groups: ["group.extended"],
        givenGroups: ["group.summary"],
        expected: true
      },
      {
        groups: ["!creation"],
        givenGroups: ["creation"],
        expected: true
      },
      {
        groups: ["group.summary"],
        givenGroups: ["creation"],
        expected: true
      },
      {
        groups: ["group.extended"],
        givenGroups: ["creation"],
        expected: true
      },
      {
        groups: ["!creation"],
        givenGroups: ["group.*"],
        expected: false
      },
      {
        groups: ["group.summary"],
        givenGroups: ["group.*"],
        expected: false
      },
      {
        groups: ["group.extended"],
        givenGroups: ["group.*"],
        expected: false
      }
    ]
  ])("should compare groups $groups with given groups $givenGroups and should return $expected", ({groups, givenGroups, expected}) => {
    expect(matchGroups(groups, givenGroups)).toEqual(expected);
  });
});
