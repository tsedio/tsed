import {colors} from "./colors";

describe("colors", () => {
  it("should call colors", () => {
    colors.green("text");
    colors.yellow("text");
    colors.red("text");
  });
});
