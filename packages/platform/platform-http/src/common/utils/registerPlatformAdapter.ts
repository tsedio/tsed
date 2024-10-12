import {Type} from "@tsed/core";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {PlatformBuilder} from "../builder/PlatformBuilder.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";

export function registerPlatformAdapter(adapter: Type<PlatformAdapter<any>>) {
  PlatformTest.adapter = adapter;
  PlatformBuilder.adapter = adapter;
}
