import {Configuration, Injectable, InjectorService, Platform} from "@tsed/common";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {generateSpec} from "@tsed/schema";
import {SwaggerOS2Settings, SwaggerOS3Settings, SwaggerSettings} from "../interfaces/SwaggerSettings.js";
import {includeRoute} from "../utils/includeRoute.js";

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
  public async getOpenAPISpec(conf: SwaggerOS3Settings): Promise<OpenSpec3>;
  public async getOpenAPISpec(conf: SwaggerOS2Settings): Promise<OpenSpec2>;
  public async getOpenAPISpec(conf: SwaggerSettings): Promise<OpenSpec2>;
  public async getOpenAPISpec(conf: SwaggerSettings) {
    if (!this.#specs.has(conf.path)) {
      const {version = "1.0.0", acceptMimes} = this.configuration;
      const specPath = conf.specPath ? this.configuration.resolve(conf.specPath) : conf.specPath;

      const tokens = this.platform
        .getMountedControllers()
        .filter(({routes, provider}) => [...routes.values()].some((route) => includeRoute(route, provider, conf)))
        .map(({route, provider}) => ({token: provider.token, rootPath: route}));

      const spec = generateSpec({
        tokens,
        ...conf,
        fileSpec: specPath ? await readSpec(specPath) : {},
        version,
        acceptMimes
      });

      this.#specs.set(conf.path, spec);
    }

    return this.#specs.get(conf.path);
  }
}
