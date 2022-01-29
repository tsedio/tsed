import {Type} from "@tsed/core";
import {Strategy} from "passport";

export interface ProtocolOptions<Settings = any> {
  name: string;
  useStrategy: Type<Strategy>;
  settings: Settings;
}
