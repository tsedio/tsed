import type {ConfigSource} from "../../interfaces/ConfigSource.js";
import {jsonParse} from "../../utils/jsonParse.js";

export interface EnvsConfigSourceOptions {
  parseJson?: boolean;
}

export class EnvsConfigSource<Config extends EnvsConfigSourceOptions = EnvsConfigSourceOptions> implements ConfigSource<Config> {
  options: Config;

  getAll(): Record<string, unknown> {
    const {parseJson = true} = this.options;

    return Object.entries(process.env).reduce((obj, [key, value]) => {
      const formattedValue = parseJson ? jsonParse(value!) : value;

      return {
        ...obj,
        [key]: formattedValue
      };
    }, {});
  }
}
