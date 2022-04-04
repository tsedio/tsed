import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("mote")
export class MoteEngine extends Engine {}
