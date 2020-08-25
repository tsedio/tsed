import {ConverterService} from "@tsed/common";
import {Args, SocketSession, SocketMiddleware} from "@tsed/socketio";
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
