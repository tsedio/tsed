import {ControllerProvider, ControllerService, EndpointMetadata, ServerSettingsService, Service} from "@tsed/common";
import {deepExtends, nameOf, Store} from "@tsed/core";
import * as Fs from "fs";
import {Schema, Spec, Tag} from "swagger-schema-official";
import {OpenApiEndpointBuilder} from "../class/OpenApiEndpointBuilder";
import {ISwaggerPaths, ISwaggerSettings, ISwaggerSpec} from "../interfaces";
import {getReducers} from "../utils";

@Service()
export class SwaggerService {
  constructor(private controllerService: ControllerService, private serverSettingsService: ServerSettingsService) {}

  /**
   *
   * @returns {Spec}
   */
  public getOpenAPISpec(conf: ISwaggerSettings): Spec {
    const defaultSpec = this.getDefaultSpec(conf);
    const paths: ISwaggerPaths = {};
    const definitions = {};
    const doc = conf.doc;
    let tags: Tag[] = [];

    const getOperationId = this.createOperationIdFormatter(conf);

    this.controllerService.routes.forEach(({provider, route}) => {
      const hidden = provider.store.get("hidden");
      const docs = provider.store.get("docs") || [];

      if ((!doc && !hidden) || (doc && docs.indexOf(doc) > -1)) {
        tags = tags.concat(this.buildRoutes(paths, definitions, provider, route, getOperationId));
      }
    });

    tags = tags.sort((a: Tag, b: Tag) => (a.name < b.name ? -1 : 1));

    return deepExtends(
      defaultSpec,
      {
        tags,
        paths,
        definitions
      },
      getReducers()
    );
  }

  /**
   * Return the global api information.
   * @returns {Info}
   */
  public getDefaultSpec(conf: ISwaggerSettings): Spec {
    const {version} = this.serverSettingsService;
    const spec: ISwaggerSpec =
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
        swagger: "2.0",
        ...spec,
        info: {
          version: versionInfo || version,
          title,
          description,
          termsOfService,
          contact,
          license
        },
        consumes: this.serverSettingsService.acceptMimes.concat(spec.consumes || []),
        produces: spec.produces || ["application/json"],
        securityDefinitions: spec.securityDefinitions || {}
      },
      specPathContent,
      getReducers()
    );
  }

  private readSpecPath(path: string) {
    path = this.serverSettingsService.resolve(path);
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
   * @param paths
   * @param definitions
   * @param ctrl
   * @param endpointUrl
   * @param getOperationId
   */
  private buildRoutes(
    paths: ISwaggerPaths,
    definitions: {[key: string]: Schema},
    ctrl: ControllerProvider,
    endpointUrl: string,
    getOperationId: (targetName: string, methodName: string) => string
  ): Tag[] {
    let tags: Tag[] = [];

    ctrl.children
      .map(ctrl => this.controllerService.get(ctrl))
      .forEach((provider: ControllerProvider) => {
        if (!provider.store.get("hidden")) {
          tags = tags.concat(this.buildRoutes(paths, definitions, provider, `${endpointUrl}${provider.path}`, getOperationId));
        }
      });

    ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {
      if (endpoint.store.get("hidden")) {
        return;
      }

      endpoint.pathsMethods.forEach(pathMethod => {
        /* istanbul ignore else */
        if (!!pathMethod.method) {
          const builder = new OpenApiEndpointBuilder(endpoint, endpointUrl, pathMethod, getOperationId).build();

          deepExtends(paths, builder.paths);
          deepExtends(definitions, builder.definitions);
        }
      });
    });

    return ctrl.endpoints.length ? tags.concat(this.buildTags(ctrl)) : tags;
  }

  /**
   *
   * @param ctrl
   */
  private buildTags(ctrl: ControllerProvider): Tag {
    const clazz = ctrl.useClass;
    const ctrlStore = Store.from(clazz);

    return Object.assign(
      {
        name: ctrlStore.get("name") || nameOf(clazz),
        description: ctrlStore.get("description")
      },
      ctrlStore.get("tag") || {}
    );
  }

  /**
   *
   * @param {ISwaggerSettings} conf
   * @returns {(targetName: string, methodName: string) => (any | string)}
   */
  private createOperationIdFormatter = (conf: ISwaggerSettings) => {
    const OPERATION_IDS: any = {};

    return (targetName: string, methodName: string) => {
      const {operationIdFormat = "%c.%m"} = conf || {};

      const operationId = operationIdFormat.replace(/%c/, targetName).replace(/%m/, methodName);
      const operationKey = targetName + methodName;

      if (OPERATION_IDS[operationKey] === undefined) {
        OPERATION_IDS[operationKey] = 0;

        return operationId;
      }

      const id = OPERATION_IDS[operationKey] + 1;

      OPERATION_IDS[operationKey] = id;

      return operationId + "_" + id;
    };
  };
}
