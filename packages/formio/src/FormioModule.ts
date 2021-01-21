import {Constant, Inject, InjectorService, OnReady, OnRoutesInit, PlatformApplication, PlatformRouteDetails} from "@tsed/common";
import {deepClone, normalizePath} from "@tsed/core";
import {Module} from "@tsed/di";
import {AlterActions} from "./components/AlterActions";
import {AlterAudit} from "./components/AlterAudit";
import {AlterHost} from "./components/AlterHost";
import {AlterLog} from "./components/AlterLog";
import {AlterSkip} from "./components/AlterSkip";
import {AlterTemplateExportSteps} from "./components/AlterTemplateExportSteps";
import {AlterTemplateImportSteps} from "./components/AlterTemplateImportSteps";
import {FormioConfig} from "./domain/FormioConfig";
import {FormioTemplate} from "./domain/FormioTemplate";
import {FormioInstaller} from "./services/FormioInstaller";
import {FormioService} from "./services/FormioService";

@Module({
  imports: [FormioService, AlterActions, AlterHost, AlterAudit, AlterLog, AlterSkip, AlterTemplateImportSteps, AlterTemplateExportSteps]
})
export class FormioModule implements OnRoutesInit, OnReady {
  @Inject()
  protected formio: FormioService;

  @Inject()
  protected installer: FormioInstaller;

  @Inject()
  protected app: PlatformApplication;

  @Inject()
  protected injector: InjectorService;

  @Constant("formio", {})
  protected settings: FormioConfig;

  @Constant("formio.baseUrl", "/")
  protected baseUrl: string;

  @Constant("formio.skipInstall", false)
  protected skipInstall: boolean;

  @Constant("formio.template")
  protected template?: FormioTemplate;

  @Constant("formio.root")
  protected root?: any;

  $onInit() {
    return this.formio.init(deepClone(this.settings));
  }

  async $onRoutesInit() {
    if (this.formio.isInit()) {
      const router: any = this.app.getRouter();

      router.use(this.baseUrl, this.formio.middleware.restrictRequestTypes, this.formio.router);

      if (await this.shouldInstall()) {
        await this.installer.install(this.template!, this.root);
      }
    }
  }

  protected async shouldInstall() {
    const hasForms = await this.installer.hasForms();

    return this.template && !(hasForms || this.skipInstall);
  }

  async $logRoutes(routes: PlatformRouteDetails[]): Promise<PlatformRouteDetails[]> {
    if (this.formio.isInit()) {
      const spec = (await this.formio.swagger(
        {
          $ctx: {
            request: {
              protocol: "http",
              host: "localhost"
            }
          }
        },
        this.formio.router
      )) as any;
      const {baseUrl} = this;

      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          routes.push({
            toJSON() {
              return {
                method,
                name: operation.operationId,
                url: normalizePath(baseUrl, path.replace(/\/{(.*)}/gi, "/:$1")),
                className: "formio",
                methodClassName: operation.operationId,
                parameters: [],
                rawBody: false
              };
            }
          } as any);
        });
      });
    }

    return routes;
  }

  // istanbul ignore next
  async $onReady(): Promise<void> {
    if (this.formio.isInit()) {
      const {injector} = this;
      const {httpsPort, httpPort} = injector.settings;

      const displayLog = (host: any) => {
        const url = [`${host.protocol}://${host.address}`, typeof host.port === "number" && host.port].filter(Boolean).join(":");

        injector.logger.info(`Form.io API is available on ${url}${this.baseUrl || "/"}`);
      };

      /* istanbul ignore next */
      if (httpsPort) {
        (this.formio.config as any).protocol = "https";
        const host = injector.settings.getHttpsPort();
        displayLog({protocol: "https", ...host});
      } else if (httpPort) {
        (this.formio.config as any).protocol = "http";
        const host = injector.settings.getHttpPort();
        displayLog({protocol: "http", ...host});
      }
    }
  }
}
