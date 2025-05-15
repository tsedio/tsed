import {existsSync, watch} from "node:fs";

import {logger} from "@tsed/di";
import JsYaml, {type LoadOptions} from "js-yaml";

import type {ConfigSource} from "../../interfaces/ConfigSource.js";

export interface YamlConfigSourceOptions extends LoadOptions {
  /**
   * The path to the JSON file.
   */
  path: string;
}

export class YamlConfigSource implements ConfigSource<YamlConfigSourceOptions> {
  options: YamlConfigSourceOptions;

  async getAll() {
    const {path, ...opts} = this.options;

    // Check if the file exists
    if (!existsSync(path)) {
      logger().warn(`Configuration file not found: ${path}`);
      return {};
    }

    // Read the file
    return (await JsYaml.load(path, opts)) as Record<string, unknown>;
  }

  watch(onChange: () => void) {
    const {path} = this.options;
    const watcher = watch(path, onChange);

    return () => {
      watcher.close();
    };
  }
}
