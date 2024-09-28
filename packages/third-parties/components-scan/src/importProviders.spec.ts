import {nameOf} from "@tsed/core";
import {resolveControllers} from "@tsed/di";

import {importProviders} from "./importProviders.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

describe("importProviders", () => {
  it("should load providers and merge configuration", async () => {
    const configuration = {
      mount: {
        "/rest": [`${rootDir}/__mock__/controllers/**/*.ts`]
      },
      imports: [`${rootDir}/__mock__/**/Module*.ts`]
    };

    const result = await importProviders(configuration);

    expect(result.imports?.map(nameOf)).toEqual(["Module1", "Module2"]);
    expect(result.mount!["/rest"].map(nameOf)).toEqual(["TestCtrl"]);

    const result2 = resolveControllers(result);

    const routes = result2.map((item) => ({...item, token: nameOf(item.token)}));

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
