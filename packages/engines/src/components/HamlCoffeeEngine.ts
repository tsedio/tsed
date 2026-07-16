import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("haml-coffee")
export class HamlCoffeeEngine extends Engine {}
