import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("liquor")
export class LiquorEngine extends Engine {}
