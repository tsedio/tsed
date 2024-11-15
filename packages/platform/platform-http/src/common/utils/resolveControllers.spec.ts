import {nameOf} from "@tsed/core";

import {Controller} from "../../../../../di/src/common/decorators/controller.js";
import {M1Ctrl1} from "../../../../../di/src/common/utils/__mock__/module1/controllers/M1Ctrl1.js";
import {Module1} from "../../../../../di/src/common/utils/__mock__/module1/Module1.js";
import {M2Ctrl} from "../../../../../di/src/common/utils/__mock__/module2/controllers/M2Ctrl.js";
import {Module2} from "../../../../../di/src/common/utils/__mock__/module2/Module2.js";
import {resolveControllers} from "./resolveControllers.js";

@Controller("/root")
class TestCtrl {}

describe("resolveControllers", () => {
  it("should load providers and merge configuration", () => {
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
