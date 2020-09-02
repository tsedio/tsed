import {createHttpServer, createHttpsServer, PlatformTest} from "@tsed/common";

import {PlatformExpress} from "./components/PlatformExpress";

PlatformTest.platformBuilder = PlatformExpress;

// decorators
export * from "./decorators/caseSensitive";
export * from "./decorators/mergeParams";
export * from "./decorators/routerSettings";
export * from "./decorators/strict";

export * from "./services";
export * from "./utils";
export * from "./components/PlatformExpress";

export {createHttpServer, createHttpsServer};
