import {existsSync, readFileSync, watch} from "node:fs";

import {logger} from "@tsed/di";

import type {ConfigSource} from "../../interfaces/ConfigSource.js";

export interface JsonConfigSourceOptions {
  /**
   * The path to the JSON file.
   */
  path: string;

  /**
   * The encoding to use when reading the file.
   * @default "utf8"
   */
  encoding?: BufferEncoding;
}

export class JsonConfigSource implements ConfigSource<JsonConfigSourceOptions> {
  options: JsonConfigSourceOptions;

  getAll(): Record<string, unknown> {
    const {path, encoding = "utf8"} = this.options;
    // Check if the file exists
    if (!existsSync(path)) {
      logger().warn(`Configuration file not found: ${path}`);
      return {};
    }

    // Read the file
    const fileContent = readFileSync(path, encoding);

    return JSON.parse(fileContent);
  }

  watch(onChange: () => void) {
    const {path} = this.options;
    const watcher = watch(path, onChange);

    return () => {
      watcher.close();
    };
  }
}
