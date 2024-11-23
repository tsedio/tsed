import Fs from "node:fs";
import {join} from "node:path";

import {Env} from "@tsed/core";
import {configuration, constant, inject, injectable, logger, ProviderType} from "@tsed/di";
import {normalizePath} from "@tsed/normalize-path";
import {application, OnReady, OnRoutesInit, PlatformContext} from "@tsed/platform-http";
import {PlatformRouter, useContextHandler} from "@tsed/platform-router";

import {ROOT_DIR, SWAGGER_UI_DIST} from "./constants.js";
import {SwaggerSettings} from "./interfaces/SwaggerSettings.js";
import {cssMiddleware} from "./middlewares/cssMiddleware.js";
import {indexMiddleware} from "./middlewares/indexMiddleware.js";
import {jsMiddleware} from "./middlewares/jsMiddleware.js";
import {redirectMiddleware} from "./middlewares/redirectMiddleware.js";
import {SwaggerService} from "./services/SwaggerService.js";

export class SwaggerModule implements OnRoutesInit, OnReady {
  protected swaggerService = inject(SwaggerService);
  protected env = constant<Env>("env");
  protected disableRoutesSummary = constant<boolean>("logger.disableRoutesSummary");

  private loaded = false;

  get settings() {
    return constant<SwaggerSettings[]>("swagger", []).filter((o) => !!o);
  }

  /**
   *
   */
  $onRoutesInit() {
    if (this.loaded) {
      return;
    }

    const urls: any[] = this.getUrls();

    this.settings.forEach((conf: SwaggerSettings) => {
      const {path = "/"} = conf;

      application().use(path, useContextHandler(redirectMiddleware(path)));
      application().use(path, this.createRouter(conf, urls));
    });

    this.loaded = true;
  }

  $onReady() {
    // istanbul ignore next
    if (configuration().getBestHost && !this.disableRoutesSummary) {
      const host = configuration().getBestHost();
      const url = host.toString();

      const displayLog = (conf: SwaggerSettings) => {
        const {path = "/", fileName = "swagger.json", doc} = conf;

        logger().info(`[${doc || "default"}] Swagger JSON is available on ${url}${normalizePath(path, fileName)}`);
        logger().info(`[${doc || "default"}] Swagger UI is available on ${url}${path}/`);
      };

      this.settings.forEach((conf) => {
        displayLog(conf);
      });
    }

    this.generateSpecFiles();
  }

  generateSpecFiles() {
    return Promise.all(
      this.settings.map(async (conf) => {
        const {outFile} = conf;

        if (this.env === Env.PROD || outFile) {
          const spec = await this.swaggerService.getOpenAPISpec(conf);

          if (outFile) {
            return Fs.writeFile(outFile, JSON.stringify(spec, null, 2), {encoding: "utf8"}, () => {});
          }
        }
      })
    );
  }

  private getUrls() {
    return this.settings.reduce((acc: any[], conf) => {
      const {path = "/", fileName = "swagger.json", doc, hidden} = conf;

      if (!hidden) {
        acc.push({url: normalizePath(path, fileName), name: doc || path});
      }

      return acc;
    }, []);
  }

  /**
   *
   * @param conf
   * @param urls
   */
  private createRouter(conf: SwaggerSettings, urls: string[]) {
    const {disableSpec = false, fileName = "swagger.json", cssPath, jsPath, viewPath = join(ROOT_DIR, "../views/index.ejs")} = conf;
    const router = new PlatformRouter();

    if (!disableSpec) {
      router.get(normalizePath("/", fileName), useContextHandler(this.middlewareSwaggerJson(conf)));
    }
    if (viewPath) {
      if (cssPath) {
        router.get("/main.css", useContextHandler(cssMiddleware(cssPath)));
      }

      if (jsPath) {
        router.get("/main.js", useContextHandler(jsMiddleware(jsPath)));
      }

      router.get("/", useContextHandler(indexMiddleware(viewPath, {urls, ...conf})));
      router.statics("/", {root: SWAGGER_UI_DIST});
    }

    return router;
  }

  private middlewareSwaggerJson(conf: SwaggerSettings) {
    return async (ctx: PlatformContext) => {
      ctx.response.status(200).body(await this.swaggerService.getOpenAPISpec(conf));
    };
  }
}

injectable(SwaggerModule).type(ProviderType.MODULE);
