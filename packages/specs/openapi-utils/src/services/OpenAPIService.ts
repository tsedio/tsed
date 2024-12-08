import {writeFile} from "node:fs/promises";

import {Env, type Type} from "@tsed/core";
import {constant, inject, injectable} from "@tsed/di";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {Platform} from "@tsed/platform-http";
import {generateSpec} from "@tsed/schema";

import {OpenAPI3Settings, OpenApiSettings, Swagger2Settings} from "../interfaces/OpenApiSettings.js";
import {includeRoute} from "../utils/includeRoute.js";
import {readSpec} from "../utils/readSpec.js";

export class OpenAPIService {
  protected platform = inject(Platform);

  #specs: Map<string, OpenSpec3 | OpenSpec2> = new Map();

  constructor() {}

  /**
   * Generate Spec for the given configuration
   */
  public async getOpenAPISpec(conf: OpenAPI3Settings): Promise<OpenSpec3>;
  public async getOpenAPISpec(conf: Swagger2Settings): Promise<OpenSpec2>;
  public async getOpenAPISpec(conf: OpenApiSettings): Promise<OpenSpec2>;
  public async getOpenAPISpec(conf: OpenApiSettings) {
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

  async writeOpenAPISpec(conf: OpenApiSettings) {
    const {outFile} = conf;
    const env = constant<Env>("env");

    if (env === Env.PROD || outFile) {
      const spec = await this.getOpenAPISpec(conf);

      if (outFile) {
        return writeFile(outFile, JSON.stringify(spec, null, 2), {encoding: "utf8"});
      }
    }
  }
}

injectable(OpenAPIService);
