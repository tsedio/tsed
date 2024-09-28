import {Args} from "../../..";
import {SocketMiddleware} from "../../..";

@SocketMiddleware()
export class ThrowErrorSocketMiddleware {
  use(@Args(0) userName: string[]) {
    throw new Error("Test");
  }
}
