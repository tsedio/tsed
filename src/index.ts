/**
 * @module core
 * @preferred
 */
/** */
if (!require.extensions[".ts"]) {
    require("source-map-support").install();
}
import "reflect-metadata";

export * from "./core";
export * from "./di";
export * from "./config";
export * from "./jsonschema";
export * from "./converters";

export * from "./filters";
export * from "./mvc";
export * from "./server";