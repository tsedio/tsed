import {PlatformTest} from "@tsed/common";

import {PlatformKoa} from "./components/PlatformKoa";

PlatformTest.platformBuilder = PlatformKoa;

// interfaces
export * from "./interfaces";

// decorators
export * from "./decorators";

// services
export * from "./services";

// components
export * from "./components/PlatformKoa";
