import {Type} from "@tsed/core";
import {PlatformBuilder} from "../builder/PlatformBuilder";
import {PlatformAdapter} from "../services/PlatformAdapter";
import {PlatformTest} from "../services/PlatformTest";

export function registerPlatformAdapter(adapter: Type<PlatformAdapter<any>>) {
  PlatformTest.adapter = adapter;
  PlatformBuilder.adapter = adapter;
}
