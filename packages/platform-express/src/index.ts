import {PlatformBuilder, PlatformTest} from "@tsed/common";

import {PlatformExpress} from "./components/PlatformExpress";

PlatformTest.platformBuilder = PlatformExpress;
PlatformBuilder.currentPlatform = PlatformExpress;

// interfaces
export * from "./interfaces";

// decorators
export * from "./decorators";

// services
export * from "./services";

// components
export * from "./components/PlatformExpress";
