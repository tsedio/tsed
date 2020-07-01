import {Configuration, ControllerProvider, InjectorService, Platform, Service} from "@tsed/common";
import {deepExtends} from "@tsed/core";
import {getSpec, SpecSerializerOptions, SpecTypes} from "@tsed/schema";
import * as Fs from "fs";
import {Spec, Tag} from "swagger-schema-official";
import {SwaggerSettings, SwaggerSpec} from "../interfaces";
import {getReducers} from "../utils";

@Service()
export class SwaggerService {
  constructor(
    private injectorService: InjectorService,
    private platform: Platform,
    @Configuration() private configuration: Configuration
  ) {}

  /**
   *
   * @returns {Spec}
   */
  public getOpenAPISpec(conf: SwaggerSettings): Spec {
    const defaultSpec = this.getDefaultSpec(conf);
    const doc = conf.doc;
    const finalSpec = {};
    // const getOperationId = this.createOperationIdFormatter(conf);
    const options = {
      paths: {},
      tags: [],
      schemas: {},
      spec: SpecTypes.SWAGGER,
      append(spec: any) {
        deepExtends(finalSpec, spec, getReducers());
      }
    };

    this.platform.routes.forEach(({provider, route}) => {
      const hidden = provider.store.get("hidden");
      const docs = provider.store.get("docs") || [];

      if ((!doc && !hidden) || (doc && docs.indexOf(doc) > -1)) {
        const spec = this.buildRoutes(provider, {
          ...options,
          rootPath: route.replace(provider.path, "")
        });

        options.append(spec);
      }
    });

    return deepExtends(defaultSpec, finalSpec, getReducers());
  }

  /**
   * Return the global api information.
   * @returns {Info}
   */
  public getDefaultSpec(conf: Partial<SwaggerSettings>): Spec {
    const {version} = this.configuration;
    const spec: SwaggerSpec =
      conf.spec ||
      ({
        info: {},
        securityDefinitions: {}
      } as any);

    const specPath = conf.specPath;

    let specPathContent = {};

    if (specPath) {
      specPathContent = this.readSpecPath(specPath);
    }

    /* istanbul ignore next */
    const {title = "Api documentation", description = "", version: versionInfo, termsOfService = "", contact, license} =
      spec.info || ({} as any);

    return deepExtends(
      {
        ...spec,
        swagger: "2.0",
        info: {
          version: versionInfo || version,
          title,
          description,
          termsOfService,
          contact,
          license
        },
        consumes: this.configuration.acceptMimes.concat(spec.consumes || []),
        produces: spec.produces || ["application/json"],
        securityDefinitions: spec.securityDefinitions || {}
      },
      specPathContent,
      getReducers()
    );
  }

  private readSpecPath(path: string) {
    path = this.configuration.resolve(path);
    if (Fs.existsSync(path)) {
      const json = Fs.readFileSync(path, {encoding: "utf8"});
      /* istanbul ignore else */
      if (json !== "") {
        return JSON.parse(json);
      }
    }

    return {};
  }

  /**
   *
   * @param ctrl
   * @param options
   */
  private buildRoutes(ctrl: ControllerProvider, options: SpecSerializerOptions): Tag[] {
    ctrl.children
      .map(ctrl => this.injectorService.getProvider(ctrl))
      .forEach((provider: ControllerProvider) => {
        if (!provider.store.get("hidden")) {
          const spec = this.buildRoutes(provider, {
            ...options,
            rootPath: `${options.rootPath}${provider.path}`
          });

          options.append(spec);
        }
      });

    return getSpec(ctrl.token, options);
  }

  /**
   *
   * @param {SwaggerSettings} conf
   * @returns {(targetName: string, methodName: string) => (any | string)}
   */
  // private createOperationIdFormatter = (conf: ISwaggerSettings) => {
  //   const OPERATION_IDS: any = {};
  //
  //   return (targetName: string, methodName: string) => {
  //     const {operationIdFormat = "%c.%m"} = conf || {};
  //
  //     const operationId = operationIdFormat.replace(/%c/, targetName).replace(/%m/, methodName);
  //     const operationKey = targetName + methodName;
  //
  //     if (OPERATION_IDS[operationKey] === undefined) {
  //       OPERATION_IDS[operationKey] = 0;
  //
  //       return operationId;
  //     }
  //
  //     const id = OPERATION_IDS[operationKey] + 1;
  //
  //     OPERATION_IDS[operationKey] = id;
  //
  //     return `${operationId}_${id}`;
  //   };
  // };
}
