import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("ejs")
export class EjsEngine extends Engine {}
