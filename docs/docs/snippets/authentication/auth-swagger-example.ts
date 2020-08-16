import {Controller, Get, Returns, UseAuth} from "@tsed/common";
import {Security} from "@tsed/swagger";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

@Controller("/dashboard")
@UseAuth(CustomAuthMiddleware, {role: "admin"}) // on class level for all endpoints
@Security("oauth2", "email", "firstname")
class DashboardCtrl {
  @Get("/")
  @UseAuth(CustomAuthMiddleware, {role: "admin"}) // or for specific endpoints
  @Security("oauth2", "email", "firstname")
  @Returns(401, {description: "Unauthorized"})
  @Returns(403, {description: "Forbidden"})
  public getResource() {
  }
}
