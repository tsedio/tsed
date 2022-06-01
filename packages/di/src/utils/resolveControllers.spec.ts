import {Controller} from "@tsed/di";

import {Module1} from "./__mock__/module1/Module1";
import {Module2} from "./__mock__/module2/Module2";
import {M1Ctrl1} from "./__mock__/module1/controllers/M1Ctrl1";
import {M2Ctrl} from "./__mock__/module2/controllers/M2Ctrl";
import {nameOf} from "@tsed/core";
import {resolveControllers} from "./resolveControllers";

@Controller("/root")
class TestCtrl {}

describe("resolveControllers", () => {
  it("should load providers and merge configuration", async () => {
    const configuration = {
      mount: {
        "/rest": [TestCtrl]
      },
      imports: [Module1, Module2]
    };

    const result = resolveControllers(configuration);
    const routes = result.map((item) => ({...item, token: nameOf(item.token)}));

    expect(routes).toEqual([
      {
        route: "/m1",
        token: "M1Ctrl1"
      },
      {
        route: "/mod2",
        token: "M2Ctrl"
      },
      {
        route: "/rest",
        token: "TestCtrl"
      }
    ]);
  });
});
