import {expect} from "chai";
import {join} from "path";
import {importComponents} from "../../../src/server/utils/importComponents";
import {Test1} from "./data/Test1";
import {Test2} from "./data/Test2";

describe("importComponents", () => {
  it("should import symbols", async () => {
    // GIVEN
    const config = [join(__dirname, "data/*.ts")];

    // WHEN
    const symbols = await importComponents(config, []);

    // THEN
    expect(symbols).to.deep.eq([
      {
        "endpoint": undefined,
        "provide": Test1
      },
      {
        "endpoint": undefined,
        "provide": Test2
      }
    ]);
  });

  it("should import symbols with endpoints", async () => {
    // GIVEN
    const config = {
      "/path/to/endpoint": join(__dirname, "data/*.ts")
    };

    // WHEN
    const symbols = await importComponents(config, []);

    // THEN
    expect(symbols).to.deep.eq([
      {
        "endpoint": "/path/to/endpoint",
        "provide": Test1
      },
      {
        "endpoint": "/path/to/endpoint",
        "provide": Test2
      }
    ]);
  });
});
