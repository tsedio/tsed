import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("mote")
export class MoteEngine extends Engine {}
