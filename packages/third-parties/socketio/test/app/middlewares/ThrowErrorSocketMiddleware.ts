import {Args} from "../../../src/index.js";
import {SocketMiddleware} from "../../../src/index.js";

@SocketMiddleware()
export class ThrowErrorSocketMiddleware {
  use(@Args(0) userName: string[]) {
    throw new Error("Test");
  }
}
