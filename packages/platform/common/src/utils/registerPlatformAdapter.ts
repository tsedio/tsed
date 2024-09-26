import type {Type} from "@tsed/core";

import {PlatformBuilder} from "../builder/PlatformBuilder.js";
import type {PlatformAdapter} from "../services/PlatformAdapter.js";
import {PlatformTest} from "../services/PlatformTest.js";

export function registerPlatformAdapter(adapter: Type<PlatformAdapter<any>>) {
  PlatformTest.adapter = adapter;
  PlatformBuilder.adapter = adapter;
}
