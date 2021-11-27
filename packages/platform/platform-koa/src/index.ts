import {PlatformBuilder, PlatformTest} from "@tsed/common";
import {PlatformKoa} from "./components/PlatformKoa";

PlatformTest.adapter = PlatformKoa;
PlatformBuilder.adapter = PlatformKoa;

// interfaces
export * from "./interfaces";

// decorators
export * from "./decorators";

// services
export * from "./services";

// components
export * from "./components/PlatformKoa";
