import {BeforeRoutesInit, Configuration, InjectorService, Module, OnReady, PlatformApplication} from "@tsed/common";
import * as Express from "express";
import * as Fs from "fs";
import {join} from "path";
import {SwaggerSettings} from "./interfaces";
import {cssMiddleware} from "./middlewares/cssMiddleware";
import {indexMiddleware} from "./middlewares/indexMiddleware";
import {jsMiddleware} from "./middlewares/jsMiddleware";
import {redirectMiddleware} from "./middlewares/redirectMiddleware";
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

  get settings() {
    return ([] as SwaggerSettings[]).concat(this.configuration.get<SwaggerSettings[]>("swagger")).filter((o) => !!o);
  }

  /**
   *
   */
  $beforeRoutesInit() {
    if (this.loaded) {
      return;
    }

    const urls: any[] = this.getUrls();

    this.settings.forEach((conf: SwaggerSettings) => {
      const {path = "/"} = conf;

      this.platformApplication.get(path, redirectMiddleware(path));
      this.platformApplication.use(path, this.createRouter(conf, urls));
    });

    this.loaded = true;
  }

  $onRoutesInit() {
    this.settings.forEach((conf) => {
      const {outFile} = conf;
      const spec = this.swaggerService.getOpenAPISpec(conf);

      if (outFile) {
        Fs.writeFileSync(outFile, JSON.stringify(spec, null, 2));
      }
    });
  }

  $onReady() {
    const {httpsPort, httpPort} = this.configuration;

    const displayLog = (host: any) => {
      this.settings.forEach((conf) => {
        const {path = "/", doc} = conf;
        const url = typeof host.port === "number" ? `${host.protocol}://${host.address}:${host.port}` : "";

        this.injector.logger.info(`[${doc || "default"}] Swagger JSON is available on ${url}${path}/swagger.json`);
        this.injector.logger.info(`[${doc || "default"}] Swagger UI is available on ${url}${path}/`);
      });
    };

    if (httpsPort) {
      const host = this.configuration.getHttpsPort();
      displayLog({protocol: "https", ...host});
    } else if (httpPort) {
      const host = this.configuration.getHttpPort();
      displayLog({protocol: "http", ...host});
    }
  }

  private getUrls() {
    return this.settings.reduce((acc: any[], conf) => {
      const {path = "/", fileName = "swagger.json", doc, hidden} = conf;
      if (!hidden) {
        acc.push({url: `${path}/${fileName}`, name: doc || path});
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
    const {cssPath, jsPath, viewPath = join(__dirname, "../views/index.ejs")} = conf;
    const router = Express.Router();

    router.get("/swagger.json", this.middlewareSwaggerJson(conf));

    if (viewPath) {
      if (cssPath) {
        router.get("/main.css", cssMiddleware(cssPath));
      }

      if (jsPath) {
        router.get("/main.js", jsMiddleware(jsPath));
      }

      router.get("/", indexMiddleware(viewPath, {urls, ...conf}));
      router.use(Express.static(swaggerUiPath));
    }

    return router;
  }

  private middlewareSwaggerJson(conf: SwaggerSettings) {
    return (req: any, res: any) => {
      res.status(200).json(this.swaggerService.getOpenAPISpec(conf));
    };
  }
}
