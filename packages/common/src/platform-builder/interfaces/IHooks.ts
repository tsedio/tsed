import {AfterInit} from "./AfterInit";
import {AfterListen} from "./AfterListen";
import {AfterRoutesInit} from "./AfterRoutesInit";
import {BeforeInit} from "./BeforeInit";
import {BeforeListen} from "./BeforeListen";
import {BeforeRoutesInit} from "./BeforeRoutesInit";
import {OnReady} from "./OnReady";

/**
 * @deprecated
 */
export interface IHooks
  extends Partial<BeforeInit & AfterInit & BeforeRoutesInit & AfterRoutesInit & BeforeListen & AfterListen & OnReady> {}
