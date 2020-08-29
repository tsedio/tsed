import {createExpressApplication, createHttpServer, createHttpsServer, ExpressApplication, PlatformTest} from "@tsed/common";

import {PlatformExpress} from "./components/PlatformExpress";

PlatformTest.platformBuilder = PlatformExpress;

export * from "./decorators";
export * from "./services";
export * from "./utils";
export * from "./components/PlatformExpress";

export {createExpressApplication, createHttpServer, createHttpsServer, ExpressApplication};
