import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("atpl")
export class AtplEngine extends Engine {}
