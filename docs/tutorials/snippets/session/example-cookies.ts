import {Cookies} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {IUser} from "./interfaces/IUser";

@Controller("/")
class MyCtrl {
  @Post("/")
  getCookies(@Cookies() cookies: any) {
    console.log("Entire cookies", cookies);
  }

  @Post("/")
  getIdInCookies(@Cookies("id") id: string) {
    console.log("ID", id);
  }

  @Post("/")
  getObjectInCookies(@Cookies("user") user: IUser) {
    console.log("user", user);
  }
}
