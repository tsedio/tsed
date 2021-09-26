import {Configuration, ControllerProvider, Injectable, InjectorService, Platform} from "@tsed/common";
import {getValue} from "@tsed/core";
import {OpenSpec3} from "@tsed/openspec";
import {getSpec, mergeSpec, SpecSerializerOptions, SpecTypes} from "@tsed/schema";
import Fs from "fs";
import {SwaggerSettings} from "../interfaces/SwaggerSettings";
import {includeRoute} from "../utils/includeRoute";
import {mapOpenSpec} from "../utils/mapOpenSpec";

@Injectable()
export class SwaggerService {
  #specs: Map<string, OpenSpec3> = new Map();

  constructor(
    private injectorService: InjectorService,
    private platform: Platform,
    @Configuration() private configuration: Configuration
  ) {}

  /**
   * Generate Spec for the given configuration
   * @returns {Spec}
   */
  public getOpenAPISpec(conf: SwaggerSettings) {
    if (!this.#specs.has(conf.path)) {
      const defaultSpec: any = this.getDefaultSpec(conf);
      let finalSpec: any = {};

      const options: SpecSerializerOptions = {
        paths: {},
        tags: [],
        schemas: {},
        specType: SpecTypes.OPENAPI,
        operationIdFormatter: conf.operationIdFormatter,
        operationIdPattern: conf.operationIdPattern,
        append(spec: any) {
          finalSpec = mergeSpec(finalSpec, spec);
        }
      };

      this.platform.getMountedControllers().forEach(({route, provider}) => {
        if (includeRoute(route, provider, conf)) {
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

  /**
   * Return the global api information.
   */
  protected getDefaultSpec(conf: Partial<SwaggerSettings>): Partial<OpenSpec3> {
    const {version = "1.0.0", acceptMimes} = this.configuration;
    const {specPath, specVersion} = conf;
    const fileSpec: Partial<OpenSpec3> = specPath ? this.readSpecPath(specPath) : {};

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
