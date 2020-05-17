if (process.env.NODE_ENV === "development") {
  require("source-map-support").install();
}
import "reflect-metadata";

export * from "./interfaces";
export * from "./utils";
export * from "./class/Metadata";
export * from "./class/Hooks";
export * from "./class/Registry";
export * from "./class/ProxyMap";
export * from "./class/ProxyRegistry";
export * from "./class/Store";
export * from "./class/Storable";
export * from "./class/EntityDescription";

// decorators
export * from "./decorators";
