import {Strategy} from "passport";
import {Type} from "@tsed/core";

export interface ProtocolOptions<Settings = any> {
  name: string;
  useStrategy: Type<Strategy>;
  settings: Settings;
}
