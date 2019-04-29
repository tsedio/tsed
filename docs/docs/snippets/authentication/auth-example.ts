import {Controller, Get, UseAuth} from "@tsed/common";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

@Controller("/dashboard")
@UseAuth(CustomAuthMiddleware, {role: "admin"}) // on class level for all endpoints
class DashboardCtrl {
  @Get("/")
  @UseAuth(CustomAuthMiddleware, {role: "admin"}) // or for specific endpoints
  public getResource() {
  }
}
