import type {Type} from "@tsed/core";
import {constant, inject, injectable} from "@tsed/di";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {Platform} from "@tsed/platform-http";
import {generateSpec} from "@tsed/schema";

import {SwaggerOS2Settings, SwaggerOS3Settings, SwaggerSettings} from "../interfaces/SwaggerSettings.js";
import {includeRoute} from "../utils/includeRoute.js";
import {readSpec} from "../utils/readSpec.js";

export class SwaggerService {
  protected platform = inject(Platform);

  #specs: Map<string, OpenSpec3 | OpenSpec2> = new Map();

  constructor() {}

  /**
   * Generate Spec for the given configuration
   * @returns {Spec}
   */
  public async getOpenAPISpec(conf: SwaggerOS3Settings): Promise<OpenSpec3>;
  public async getOpenAPISpec(conf: SwaggerOS2Settings): Promise<OpenSpec2>;
  public async getOpenAPISpec(conf: SwaggerSettings): Promise<OpenSpec2>;
  public async getOpenAPISpec(conf: SwaggerSettings) {
    if (!this.#specs.has(conf.path)) {
      const version = constant("version", "1.0.0");
      const acceptMimes = constant<string>("acceptMimes");
      const specPath = conf.specPath;

      const tokens = this.platform
        .getMountedControllers()
        .filter(({routes, provider}) => [...routes.values()].some((route) => includeRoute(route, provider, conf)))
        .map(({route, provider}) => ({token: provider.token as Type, rootPath: route}));

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

injectable(SwaggerService);
