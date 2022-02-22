import {PlatformBuilder, PlatformTest} from "@tsed/common";
import {PlatformKoa} from "./components/PlatformKoa";

PlatformTest.adapter = PlatformKoa;
PlatformBuilder.adapter = PlatformKoa;
