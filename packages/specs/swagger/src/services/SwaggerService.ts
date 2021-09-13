import {Configuration, ControllerProvider, Injectable, InjectorService, Platform} from "@tsed/common";
import {getValue} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {getSpec, mergeSpec, SpecSerializerOptions} from "@tsed/schema";
import Fs from "fs";
import {SwaggerOS2Settings, SwaggerOS3Settings, SwaggerSettings} from "../interfaces/SwaggerSettings";
import {getSpecTypeFromSpec} from "../utils/getSpecType";
import {mapOpenSpec} from "../utils/mapOpenSpec";
import {matchPath} from "../utils/matchPath";

@Injectable()
export class SwaggerService {
  #specs: Map<string, OpenSpec3 | OpenSpec2> = new Map();

  constructor(
    private injectorService: InjectorService,
    private platform: Platform,
    @Configuration() private configuration: Configuration
  ) {}

  /**
   * Generate Spec for the given configuration
   * @returns {Spec}
   */
  public getOpenAPISpec(conf: SwaggerOS3Settings): OpenSpec3;
  public getOpenAPISpec(conf: SwaggerOS2Settings): OpenSpec2;
  public getOpenAPISpec(conf: SwaggerSettings): OpenSpec2;
  public getOpenAPISpec(conf: SwaggerSettings) {
    if (!this.#specs.has(conf.path)) {
      const defaultSpec: any = this.getDefaultSpec(conf);
      const specType = getSpecTypeFromSpec(defaultSpec);
      let finalSpec: any = {};

      const options: SpecSerializerOptions = {
        paths: {},
        tags: [],
        schemas: {},
        specType,
        operationIdFormatter: conf.operationIdFormatter,
        operationIdPattern: conf.operationIdPattern,
        append(spec: any) {
          finalSpec = mergeSpec(finalSpec, spec);
        }
      };

      this.platform.getMountedControllers().forEach(({route, provider}) => {
        if (this.includeRoute(route, provider, conf)) {
          const spec = this.buildRoutes(provider, {
            ...options,
            rootPath: route.replace(provider.path, "")
          });

          options.append(spec);
        }
      });

      this.#specs.set(conf.path, mergeSpec(defaultSpec, finalSpec) as any);
    }

    return this.#specs.get(conf.path);
  }

  includeRoute(route: string, provider: ControllerProvider, conf: SwaggerSettings) {
    const hidden = provider.store.get("hidden");
    const docs = provider.store.get("docs") || [];
    const {doc} = conf;
    const inDoc = (!doc && !hidden) || (doc && docs.indexOf(doc) > -1);

    return inDoc || matchPath(route, conf.pathPatterns);
  }

  /**
   * Return the global api information.
   */
  protected getDefaultSpec(conf: Partial<SwaggerSettings>): Partial<OpenSpec2 | OpenSpec3> {
    const {version = "1.0.0", acceptMimes} = this.configuration;
    const {specPath, specVersion} = conf;
    const fileSpec: Partial<OpenSpec2 | OpenSpec3> = specPath ? this.readSpecPath(specPath) : {};

    return mapOpenSpec(getValue(conf, "spec", {}), {
      fileSpec,
      version,
      specVersion,
      acceptMimes
    });
  }

  protected readSpecPath(path: string) {
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
  protected buildRoutes(ctrl: ControllerProvider, options: SpecSerializerOptions) {
    const rootPath = options.rootPath + ctrl.path;

    ctrl.children
      .map((ctrl) => this.injectorService.getProvider(ctrl))
      .forEach((provider: ControllerProvider) => {
        if (!provider.store.get("hidden")) {
          const spec = this.buildRoutes(provider, {
            ...options,
            rootPath
          });

          options.append(spec);
        }
      });

    return getSpec(ctrl.token, options);
  }
}
