import {join} from "node:path";

import {constant, injectable, ProviderType} from "@tsed/di";
import {OpenAPIBaseModule} from "@tsed/openapi-utils";
import {useContextHandler} from "@tsed/platform-router";

import {ROOT_DIR} from "./constants.js";
import {ScalarSettings} from "./interfaces/ScalarSettings.js";
import {indexMiddleware} from "./middlewares/indexMiddleware.js";

export class ScalarModule extends OpenAPIBaseModule {
  readonly name = "Scalar";
  readonly rootDir = ROOT_DIR;

  get settings() {
    const settings = constant<ScalarSettings[]>("scalar", []).filter((o) => !!o);

    return settings.map((conf) => {
      return Object.assign(
        {
          disableSpec: false,
          _integration: "tsed",
          cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference",
          path: "/",
          fileName: "openapi.json",
          cssPath: join(ROOT_DIR, "views/assets/scalar.css"),
          viewPath: join(ROOT_DIR, "views/scalar.ejs")
        },
        conf
      );
    });
  }

  protected createRouter(conf: ScalarSettings) {
    const {viewPath} = conf;
    const router = super.createRouter(conf);

    if (viewPath) {
      router.get("/", useContextHandler(indexMiddleware(viewPath, conf)));
    }

    return router;
  }
}

injectable(ScalarModule).type(ProviderType.MODULE);
