import {BodyParams, Controller, Get, PathParams, Post, ProviderScope, Scope, Session, Status} from "@tsed/common";
import {MultipartFile} from "@tsed/multipartfiles";
import {Required} from "@tsed/schema";
import {Docs, Hidden} from "@tsed/swagger";
import {IUser, User} from "../../models/User";
import {UserService} from "../../services/UserService";

@Controller("/user")
@Scope(ProviderScope.REQUEST)
@Hidden()
@Docs("hidden")
export class UserCtrl {
  userId: string;

  constructor(public userService: UserService) {}

  @Post("/connect")
  @Status(204)
  async connect(@Session() session: Express.Session, @BodyParams("user") user: User) {
    session.user = user;
  }

  @Get("/get-connected")
  async getConnected(@Session("user") user: User): Promise<IUser> {
    return user;
  }

  @Post("/avatar/:username")
  test(
    @MultipartFile() myFile: Express.Multer.File,
    @Required()
    @PathParams("username")
    username: string
  ) {
    // Logic ...
  }
}
