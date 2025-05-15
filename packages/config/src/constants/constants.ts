import {ConfigSource} from "../interfaces/ConfigSource.js";

export const CONFIG_SOURCES = Symbol.for("CONFIG_SOURCES");
export type CONFIG_SOURCES = Record<string, ConfigSource>;
