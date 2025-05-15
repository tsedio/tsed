import {watch} from "node:fs";
import {join} from "node:path";

import dotenvExpand from "dotenv-expand";
import dotenv, {type DotenvFlowConfigOptions} from "dotenv-flow";
import {globby} from "globby";

import type {ConfigSourceOnChangeCB} from "../../interfaces/ConfigSource.js";
import {EnvsConfigSource, type EnvsConfigSourceOptions} from "../envs/EnvsConfigSource.js";

export type DotEnvsConfigSourceOptions = EnvsConfigSourceOptions & DotenvFlowConfigOptions;

export class DotEnvsConfigSource extends EnvsConfigSource<DotEnvsConfigSourceOptions> {
  getAll(): Record<string, unknown> {
    dotenvExpand.expand(dotenv.config(this.options));

    return super.getAll();
  }

  async watch(onChange?: ConfigSourceOnChangeCB) {
    const files = await globby(join(this.options.path!, ".env"), {
      dot: true,
      absolute: true
    });

    const watchers = files.map((file) => {
      const watcher = watch(file, onChange);

      return () => {
        watcher.close();
      };
    });

    return () => {
      watchers.map((close) => {
        return close();
      });
    };
  }
}
