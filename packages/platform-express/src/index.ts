import {createHttpServer, createHttpsServer, PlatformTest} from "@tsed/common";

import {PlatformExpress} from "./components/PlatformExpress";

PlatformTest.platformBuilder = PlatformExpress;

export * from "./middlewares";
export * from "./services";
export * from "./utils";
export * from "./components/PlatformExpress";

export {createHttpServer, createHttpsServer};
