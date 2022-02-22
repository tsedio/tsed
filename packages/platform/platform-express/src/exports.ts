import {PlatformBuilder, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "./components/PlatformExpress";

PlatformTest.adapter = PlatformExpress as any;
PlatformBuilder.adapter = PlatformExpress as any;
