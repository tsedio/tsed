import {envs} from "./envs/index.js";
import loggerConfig from "./logger/index.js";

export const config: Partial<TsED.Configuration> = {
  envs,
  logger: loggerConfig
};
