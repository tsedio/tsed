if (!require.extensions[".ts"]) {
  require("source-map-support").install();
}
import "reflect-metadata";

export * from "./interfaces";
export * from "./utils";
export * from "./class/Metadata";
export * from "./class/Registry";
export * from "./class/ProxyMap";
export * from "./class/ProxyRegistry";
export * from "./class/Store";
export * from "./class/Storable";
export * from "./class/EntityDescription";

// decorators
export * from "./decorators";
