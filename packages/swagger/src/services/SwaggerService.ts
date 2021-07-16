import {Configuration, ControllerProvider, Injectable, InjectorService, Platform} from "@tsed/common";
import {getValue, setValue} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {getSpec, mergeSpec, SpecSerializerOptions} from "@tsed/schema";
import Fs from "fs";
import {SwaggerOS2Settings, SwaggerOS3Settings, SwaggerSettings} from "../interfaces/SwaggerSettings";
import {getSpecTypeFromSpec} from "../utils/getSpecType";
import {mapOpenSpec} from "../utils/mapOpenSpec";

@Injectable()
export class SwaggerService {
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
    const defaultSpec: any = this.getDefaultSpec(conf);
    const specType = getSpecTypeFromSpec(defaultSpec);
    const {doc} = conf;
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

    return mergeSpec(defaultSpec, finalSpec) as any;
  }

  /**
   * Return the global api information.
   */
  protected getDefaultSpec(conf: Partial<SwaggerSettings>): Partial<OpenSpec2 | OpenSpec3> {
    const {version, acceptMimes} = this.configuration;
    const {specPath, specVersion} = conf;
    const fileSpec: Partial<OpenSpec2 | OpenSpec3> = specPath ? this.readSpecPath(specPath) : {};

    const finalSpec = mapOpenSpec(getValue(conf, "spec", {}), {
      fileSpec,
      version,
      specVersion,
      acceptMimes
    });

    setValue(finalSpec, "info.title", getValue(finalSpec, "info.title", "Api documentation"));
    setValue(finalSpec, "info.version", getValue(finalSpec, "info.version", "1.0.0"));

    return finalSpec;
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
