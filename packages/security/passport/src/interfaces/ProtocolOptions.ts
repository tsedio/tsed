import type {Type} from "@tsed/core";
import type {Strategy} from "passport";

export interface ProtocolOptions<Settings = any> {
  name: string;
  useStrategy: Type<Strategy>;
  settings: Settings;
}
