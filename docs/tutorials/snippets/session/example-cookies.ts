import {Controller, Cookies, Post} from "@tsed/common";
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
