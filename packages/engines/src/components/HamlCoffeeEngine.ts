import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("haml-coffee")
export class HamlCoffeeEngine extends Engine {}
