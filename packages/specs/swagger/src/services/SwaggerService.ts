import {Configuration, Injectable, InjectorService, Platform} from "@tsed/common";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {generateSpec} from "@tsed/schema";
import {SwaggerOS2Settings, SwaggerOS3Settings, SwaggerSettings} from "../interfaces/SwaggerSettings";
import {includeRoute} from "../utils/includeRoute";

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
      const {version = "1.0.0", acceptMimes} = this.configuration;
      const specPath = conf.specPath ? this.configuration.resolve(conf.specPath) : conf.specPath;

      const tokens = this.platform
        .getMountedControllers()
        .filter(({route, provider}) => includeRoute(route, provider, conf))
        .map(({route, provider}) => ({token: provider.token, rootPath: route.replace(provider.path, "")}));

      const spec = generateSpec({
        tokens,
        ...conf,
        specPath,
        version,
        acceptMimes
      });

      this.#specs.set(conf.path, spec);
    }

    return this.#specs.get(conf.path);
  }
}
