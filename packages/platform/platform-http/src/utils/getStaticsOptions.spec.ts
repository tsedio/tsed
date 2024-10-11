import {getStaticsOptions} from "./getStaticsOptions.js";

describe("getStaticsOptions()", () => {
  it("should return the statics files options", () => {
    const result = getStaticsOptions({
      "/": ["/root", {root: "/root2", test: "test", hook: "$beforeRoutesInit"}]
    });

    expect(result).toEqual([
      {
        options: {
          hook: "$afterRoutesInit",
          root: "/root"
        },
        path: "/"
      },
      {
        options: {
          hook: "$beforeRoutesInit",
          root: "/root2",
          test: "test"
        },
        path: "/"
      }
    ]);
  });
});
