import {createHttpServer, createHttpsServer, PlatformTest} from "@tsed/common";

import {PlatformExpress} from "./components/PlatformExpress";

PlatformTest.platformBuilder = PlatformExpress;

// interfaces
export * from "./interfaces";

// decorators
export * from "./decorators/caseSensitive";
export * from "./decorators/mergeParams";
export * from "./decorators/routerSettings";
export * from "./decorators/strict";

// services
export * from "./services";

// components
export * from "./components/PlatformExpress";

export {createHttpServer, createHttpsServer};
