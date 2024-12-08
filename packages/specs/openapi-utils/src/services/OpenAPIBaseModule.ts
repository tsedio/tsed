import {basename} from "node:path";

import {Env} from "@tsed/core";
import {configuration, constant, inject, logger} from "@tsed/di";
import {normalizePath} from "@tsed/normalize-path";
import {application, OnReady, OnRoutesInit} from "@tsed/platform-http";
import {PlatformRouter, useContextHandler} from "@tsed/platform-router";

import {OpenAPIService} from "../..";
import type {OpenApiSettings} from "../interfaces/OpenApiSettings.js";
import {cssMiddleware} from "../middlewares/cssMiddleware.js";
import {jsMiddleware} from "../middlewares/jsMiddleware.js";
import {openApiMiddleware} from "../middlewares/openApiMiddleware.js";
import {redirectMiddleware} from "../middlewares/redirectMiddleware.js";

export abstract class OpenAPIBaseModule implements OnRoutesInit, OnReady {
  abstract name: string;
  abstract rootDir: string;
  abstract settings: OpenApiSettings[];
  protected openAPIService = inject(OpenAPIService);
  protected env = constant<Env>("env");
  protected disableRoutesSummary = constant<boolean>("logger.disableRoutesSummary");
  private loaded = false;

  $onRoutesInit() {
    if (this.loaded) {
      return;
    }

    this.settings.forEach((conf: OpenApiSettings) => {
      const {path = "/"} = conf;

      application().use(path, useContextHandler(redirectMiddleware(path)));
      application().use(path, this.createRouter(conf));
    });

    this.loaded = true;
  }

  $onReady() {
    // istanbul ignore next
    if (configuration().getBestHost && !this.disableRoutesSummary) {
      const host = configuration().getBestHost();
      const url = host.toString();

      const displayLog = (conf: OpenApiSettings) => {
        const {path, fileName, doc, specVersion} = conf;

        logger().info(
          `[${doc || "default"}] ${specVersion === "2.0" ? "Swagger" : "OpenAPI"} JSON is available on ${url}${normalizePath(path, fileName!)}`
        );
        logger().info(`[${doc || "default"}] ${this.name} UI is available on ${url}${path}/`);
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
        this.openAPIService.writeOpenAPISpec(conf);
      })
    );
  }

  protected createRouter(conf: OpenApiSettings) {
    const {disableSpec, fileName, cssPath, jsPath, viewPath} = conf;
    const router = new PlatformRouter();

    if (!disableSpec) {
      router.get(normalizePath("/", fileName!), useContextHandler(openApiMiddleware(conf)));
    }

    if (viewPath) {
      if (cssPath) {
        router.get(`/${basename(cssPath)}`, useContextHandler(cssMiddleware(cssPath)));
      }

      if (jsPath) {
        router.get(`/${basename(jsPath)}`, useContextHandler(jsMiddleware(jsPath)));
      }
    }

    return router;
  }
}
