import {BeforeRoutesInit, Configuration, InjectorService, Module, OnReady, PlatformApplication} from "@tsed/common";
import * as Express from "express";
import * as Fs from "fs";
import {join, resolve} from "path";
import {ISwaggerSettings} from "./interfaces";
import {SwaggerService} from "./services/SwaggerService";

const swaggerUiPath = require("swagger-ui-dist").absolutePath();

@Module()
export class SwaggerModule implements BeforeRoutesInit, OnReady {
  private loaded = false;

  constructor(
    private injector: InjectorService,
    private swaggerService: SwaggerService,
    @Configuration() private configuration: Configuration,
    private platformApplication: PlatformApplication
  ) {}

  /**
   *
   */
  $beforeRoutesInit() {
    if (this.loaded) {
      return;
    }

    const swagger: ISwaggerSettings[] = [].concat(this.configuration.get("swagger")).filter(o => !!o);

    const urls: any[] = swagger.reduce((acc: any[], conf) => {
      const {path = "/", doc, hidden} = conf;
      if (!hidden) {
        acc.push({url: `${path}/swagger.json`, name: doc || path});
      }

      return acc;
    }, []);

    swagger.forEach((conf: ISwaggerSettings) => {
      const {path = "/"} = conf;

      this.platformApplication.get(path, this.middlewareRedirect(path));
      this.platformApplication.use(path, this.createRouter(conf, urls));
    });
    this.loaded = true;
  }

  $onRoutesInit() {
    const swagger: ISwaggerSettings[] = [].concat(this.configuration.get("swagger")).filter(o => !!o);

    swagger.forEach((conf: ISwaggerSettings) => {
      const {outFile} = conf;
      const spec = this.swaggerService.getOpenAPISpec(conf);

      if (outFile) {
        Fs.writeFileSync(outFile, JSON.stringify(spec, null, 2));
      }
    });
  }

  $onReady() {
    const displayLog = (host: any) => {
      const swagger: ISwaggerSettings[] = [].concat(this.configuration.get("swagger")).filter(o => !!o);
      swagger.forEach((conf: ISwaggerSettings) => {
        const {path = "/", doc} = conf;
        const url = typeof host.port === "number" ? `${host.protocol}://${host.address}:${host.port}` : "";

        this.injector.logger.info(`[${doc || "default"}] Swagger JSON is available on ${url}${path}/swagger.json`);
        this.injector.logger.info(`[${doc || "default"}] Swagger UI is available on ${url}${path}/`);
      });
    };

    if (this.configuration.httpsPort) {
      const host = this.configuration.getHttpsPort();
      displayLog({protocol: "https", ...host});
    } else if (this.configuration.httpPort) {
      const host = this.configuration.getHttpPort();
      displayLog({protocol: "http", ...host});
    }
  }

  /**
   *
   * @param {ISwaggerSettings} conf
   * @param urls
   */
  private createRouter(conf: ISwaggerSettings, urls: string[]) {
    const {cssPath, jsPath, viewPath = join(__dirname, "../views/index.ejs")} = conf;
    const router = Express.Router();

    router.get("/swagger.json", this.middlewareSwaggerJson(conf));

    if (viewPath) {
      if (cssPath) {
        router.get("/main.css", this.middlewareCss(cssPath));
      }

      if (jsPath) {
        router.get("/main.js", this.middlewareJs(jsPath));
      }

      router.get("/", this.middlewareIndex({...conf, viewPath}, urls));
      router.use(Express.static(swaggerUiPath));
    }

    return router;
  }

  private middlewareSwaggerJson(conf: ISwaggerSettings) {
    return (req: any, res: any) => {
      res.status(200).json(this.swaggerService.getOpenAPISpec(conf));
    };
  }

  private mapSwaggerUIConfig(conf: ISwaggerSettings, urls: string[]) {
    const {path = "/", options = {}, showExplorer, cssPath, jsPath} = conf;
    const spec = this.swaggerService.getOpenAPISpec(conf);

    return {
      spec,
      url: `${path}/swagger.json`,
      urls,
      showExplorer,
      cssPath,
      jsPath,
      swaggerOptions: options
    };
  }

  private middlewareRedirect(path: string) {
    /* istanbul ignore next */
    return (req: any, res: any, next: any) => {
      if (req.url === path && !req.url.match(/\/$/)) {
        res.redirect(`${path}/`);
      } else {
        next();
      }
    };
  }

  /**
   *
   * @returns {(req: any, res: any) => any}
   * @param conf
   * @param urls
   */
  private middlewareIndex(conf: ISwaggerSettings, urls: string[]) {
    /* istanbul ignore next */
    return (req: any, res: any) => {
      const data = this.mapSwaggerUIConfig(conf, urls);
      res.render(conf.viewPath, data);
    };
  }

  /**
   *
   * @param {string} path
   */
  private middlewareCss(path: string) {
    /* istanbul ignore next */
    return (req: any, res: any) => {
      const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});
      res.set("Content-Type", "text/css");
      res.status(200).send(content);
    };
  }

  /**
   *
   * @param {string} path
   */
  private middlewareJs(path: string) {
    /* istanbul ignore next */
    return (req: any, res: any) => {
      const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});
      res.set("Content-Type", "application/javascript");
      res.status(200).send(content);
    };
  }
}
