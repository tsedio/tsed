import "@tsed/logger";
import "@tsed/logger-file";

export * from "@tsed/di";
export * from "@tsed/platform-params";
export * from "@tsed/platform-exceptions";
export * from "@tsed/platform-response-filter";
export * from "@tsed/platform-cache";
export * from "@tsed/platform-middlewares";
export * from "@tsed/components-scan";
export * from "@tsed/platform-log-middleware";

export {$log, Logger} from "@tsed/logger";

export * from "./config";

// builder
export * from "./builder/PlatformBuilder";
export * from "./builder/PlatformControllerBuilder";

// decorators
export * from "./decorators";

// interfaces
export * from "./constants/routerOptions";
export * from "./interfaces";

// middlewares
export * from "./middlewares";

// domain
export * from "./domain";

// providers
export * from "./services";

// utils
export * from "./utils";

// Module
export * from "./PlatformModule";
