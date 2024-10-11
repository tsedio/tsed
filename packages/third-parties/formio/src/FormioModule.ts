import {deepClone} from "@tsed/core";
import {Constant, Inject, InjectorService, Module} from "@tsed/di";
import {normalizePath} from "@tsed/normalize-path";
import {OnReady, OnRoutesInit, PlatformApplication, PlatformRouteDetails} from "@tsed/platform-http";

import {AlterActions} from "./components/AlterActions.js";
import {AlterAudit} from "./components/AlterAudit.js";
import {AlterHost} from "./components/AlterHost.js";
import {AlterLog} from "./components/AlterLog.js";
import {AlterSkip} from "./components/AlterSkip.js";
import {AlterTemplateExportSteps} from "./components/AlterTemplateExportSteps.js";
import {AlterTemplateImportSteps} from "./components/AlterTemplateImportSteps.js";
import {FormioConfig} from "./domain/FormioConfig.js";
import {FormioTemplate} from "./domain/FormioTemplate.js";
import {FormioAuthService} from "./services/FormioAuthService.js";
import {FormioHooksService} from "./services/FormioHooksService.js";
import {FormioInstaller} from "./services/FormioInstaller.js";
import {FormioService} from "./services/FormioService.js";

@Module({
  imports: [
    FormioService,
    FormioHooksService,
    FormioAuthService,
    AlterActions,
    AlterHost,
    AlterAudit,
    AlterLog,
    AlterSkip,
    AlterTemplateImportSteps,
    AlterTemplateExportSteps
  ]
})
export class FormioModule implements OnRoutesInit, OnReady {
  @Inject()
  protected formio: FormioService;

  @Inject()
  protected hooks: FormioHooksService;

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
    return this.init(deepClone(this.settings));
  }

  init(options: FormioConfig) {
    return this.formio.init(options, this.hooks.getHooks());
  }

  async $onRoutesInit() {
    if (this.formio.isInit()) {
      this.app.use(this.baseUrl, this.formio.middleware.restrictRequestTypes, this.formio.router);

      if (await this.shouldInstall()) {
        await this.installer.install(this.template!, this.root);
      }
    }
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
            method,
            name: operation.operationId,
            url: normalizePath(baseUrl, path.replace(/\/{(.*)}/gi, "/:$1")),
            className: "formio",
            methodClassName: operation.operationId
          });
        });
      });
    }

    return routes;
  }

  // istanbul ignore next
  $onReady() {
    if (this.formio.isInit() && "getBestHost" in this.injector.settings) {
      const {injector} = this;
      // @ts-ignore
      const host = injector.settings.getBestHost();
      const url = host.toString();

      injector.logger.info(`Form.io API is available on ${url}${this.baseUrl || "/"}`);
    }
  }

  protected async shouldInstall() {
    const hasForms = await this.installer.hasForms();
    return this.template && !(hasForms || this.skipInstall);
  }
}
