import {join} from "path";
import {Test1} from "./__mock__/Test1";
import {Test2} from "./__mock__/Test2";
import {importComponents} from "./importComponents";

describe("importComponents", () => {
  it("should import symbols", async () => {
    // GIVEN
    const config = [join(__dirname, "__mock__/*.ts")];

    // WHEN
    const symbols = await importComponents(config, []);

    // THEN
    expect(symbols).toEqual([
      {
        route: undefined,
        token: Test1
      },
      {
        route: undefined,
        token: Test2
      }
    ]);
  });

  it("should import symbols with endpoints", async () => {
    // GIVEN
    const config = {
      "/path/to/endpoint": join(__dirname, "__mock__/*.ts")
    };

    // WHEN
    const symbols = await importComponents(config, []);

    // THEN
    expect(symbols).toEqual([
      {
        route: "/path/to/endpoint",
        token: Test1
      },
      {
        route: "/path/to/endpoint",
        token: Test2
      }
    ]);
  });
});
