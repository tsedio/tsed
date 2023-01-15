import {Type} from "@tsed/core";
import {PlatformAdapter} from "../services/PlatformAdapter";
import {registerPlatformAdapter} from "../utils/registerPlatformAdapter";

export function PlatformProvider() {
  return (klass: Type<PlatformAdapter>) => {
    registerPlatformAdapter(klass);
  };
}
