import {Type} from "@tsed/core";

import {PlatformBuilder} from "../builder/PlatformBuilder.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";
import {PlatformTest} from "../services/PlatformTest.js";

export function registerPlatformAdapter(adapter: Type<PlatformAdapter<any>>) {
  PlatformTest.adapter = adapter;
  PlatformBuilder.adapter = adapter;
}
