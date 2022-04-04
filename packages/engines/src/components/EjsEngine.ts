import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("ejs")
export class EjsEngine extends Engine {}
