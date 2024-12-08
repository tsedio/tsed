import {join} from "node:path";

import {constant, injectable, ProviderType} from "@tsed/di";
import {normalizePath} from "@tsed/normalize-path";
import {OpenAPIBaseModule} from "@tsed/openapi-utils";
import {useContextHandler} from "@tsed/platform-router";

import {ROOT_DIR, SWAGGER_UI_DIST} from "./constants.js";
import {SwaggerSettings} from "./interfaces/SwaggerSettings.js";
import {indexMiddleware} from "./middlewares/indexMiddleware.js";

export class SwaggerModule extends OpenAPIBaseModule {
  readonly name = "Swagger";
  readonly rootDir = ROOT_DIR;

  get settings() {
    const settings = constant<SwaggerSettings[]>("swagger", []).filter((o) => !!o);

    return settings.map((conf) => {
      return Object.assign(
        {
          disableSpec: false,
          path: "/",
          fileName: "swagger.json",
          cssPath: join(ROOT_DIR, "views/assets/swagger.css"),
          viewPath: join(ROOT_DIR, "views/index.ejs")
        },
        conf
      );
    });
  }

  protected createRouter(conf: SwaggerSettings) {
    const {viewPath} = conf;
    const router = super.createRouter(conf);

    if (viewPath) {
      router.get(
        "/",
        useContextHandler(
          indexMiddleware(viewPath, {
            urls: this.getUrls(),
            ...conf
          })
        )
      );
      router.statics("/", {root: SWAGGER_UI_DIST});
    }

    return router;
  }

  protected getUrls() {
    return this.settings.reduce((acc: any[], conf) => {
      const {path, fileName, doc, hidden} = conf;

      if (!hidden) {
        acc.push({url: normalizePath(path, fileName!), name: doc || path});
      }

      return acc;
    }, []);
  }
}

injectable(SwaggerModule).type(ProviderType.MODULE);
