import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("slm")
export class SlmEngine extends Engine {}
