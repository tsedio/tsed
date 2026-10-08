import type {ConfigSource, ConfigSourceOnChangeCB} from "../../interfaces/ConfigSource.js";
import {load, type LoadOptions} from "js-yaml";
import {existsSync, readFileSync, watch} from "node:fs";
import {logger} from "@tsed/di";

export interface YamlConfigSourceOptions extends LoadOptions {
  /**
   * The path to the YAML file.
   */
  path: string;

  /**
   * The encoding to use when reading the file.
   * @default "utf8"
   */
  encoding?: BufferEncoding;
}

export class YamlConfigSource implements ConfigSource<YamlConfigSourceOptions> {
  options!: YamlConfigSourceOptions;

  async getAll() {
    const {path, encoding = "utf8", ...opts} = this.options;

    // Check if the file exists
    if (!existsSync(path)) {
      logger().warn(`Configuration file not found: ${path}`);
      return {};
    }

    // Read the file
    const fileContent = readFileSync(path, encoding);

    return ((await load(fileContent, opts)) || {}) as Record<string, unknown>;
  }

  watch(onChange: ConfigSourceOnChangeCB) {
    const {path} = this.options;
    const watcher = watch(path, onChange);

    return () => {
      watcher.close();
    };
  }
}
