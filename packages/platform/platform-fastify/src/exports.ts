import {PlatformBuilder, PlatformTest} from "@tsed/common";
import {PlatformFastify} from "./components/PlatformFastify";

PlatformTest.adapter = PlatformFastify;
PlatformBuilder.adapter = PlatformFastify;
