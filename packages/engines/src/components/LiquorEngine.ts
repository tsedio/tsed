import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("liquor")
export class LiquorEngine extends Engine {}
