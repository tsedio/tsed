import {injectable} from "../fn/injectable.js";
import {injector} from "../fn/injector.js";
import {DILogger} from "../interfaces/DILogger.js";

export const LOGGER = Symbol.for("LOGGER");
export type LOGGER = DILogger;

injectable(LOGGER).factory(() => injector().logger);
