import {colors} from "./colors.js";

describe("colors", () => {
  it("should call colors", () => {
    colors.green("text");
    colors.yellow("text");
    colors.red("text");
  });
});
