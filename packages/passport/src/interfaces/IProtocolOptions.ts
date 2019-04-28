import {Type} from "@tsed/core";
import {Strategy} from "passport-strategy";

export interface IProtocolOptions {
  name: string;
  useStrategy: Type<Strategy>;
  // seFor: string[];
  settings: any;
}
