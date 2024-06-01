import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("liquor")
export class LiquorEngine extends Engine {}
