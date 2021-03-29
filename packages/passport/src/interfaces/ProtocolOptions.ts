import {Type} from "@tsed/core";
import {Strategy} from "passport";

export interface ProtocolOptions<T = any> {
  name: string;
  useStrategy: Type<Strategy>;
  settings: T;
}
