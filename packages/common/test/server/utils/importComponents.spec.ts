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
        "route": undefined,
        "token": Test1
      },
      {
        "route": undefined,
        "token": Test2
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
        "route": "/path/to/endpoint",
        "token": Test1
      },
      {
        "route": "/path/to/endpoint",
        "token": Test2
      }
    ]);
  });
});
