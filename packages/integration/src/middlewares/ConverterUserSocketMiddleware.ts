import {ConverterService} from "@tsed/common";
import {Args, SocketSession} from "../../../../packages/socketio/src";
import {SocketMiddleware} from "../../../../packages/socketio/src/decorators/socketMiddleware";
import {User} from "../models/User";

@SocketMiddleware()
export class ConverterUserSocketMiddleware {
  constructor(private converterService: ConverterService) {}

  use(@Args(0) user: any[], @SocketSession session: Map<string, any>) {
    session.set("test", "test2");
    user = this.converterService.deserialize(user, User);

    return [user];
  }
}
