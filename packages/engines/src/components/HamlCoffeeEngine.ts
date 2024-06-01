import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("haml-coffee")
export class HamlCoffeeEngine extends Engine {}
