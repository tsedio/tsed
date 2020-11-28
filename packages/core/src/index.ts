if (process.env.NODE_ENV === "development") {
  require("source-map-support").install();
}
import "reflect-metadata";

export * from "./interfaces";
export * from "./utils";
export * from "./domain";
export * from "./errors/UnsupportedDecoratorType";

// decorators
export * from "./decorators";
