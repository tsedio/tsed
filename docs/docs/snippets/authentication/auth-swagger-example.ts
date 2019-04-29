import {Controller, Get, UseAuth} from "@tsed/common";
import {Responses, Security} from "@tsed/swagger";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

@Controller("/dashboard")
@UseAuth(CustomAuthMiddleware, {role: "admin"}) // on class level for all endpoints
@Security("oauth2", "email", "firstname")
@Responses(401, {description: "Unauthorized"})
@Responses(403, {description: "Forbidden"})
class DashboardCtrl {
  @Get("/")
  @UseAuth(CustomAuthMiddleware, {role: "admin"}) // or for specific endpoints
  @Security("oauth2", "email", "firstname")
  @Responses(401, {description: "Unauthorized"})
  @Responses(403, {description: "Forbidden"})
  public getResource() {
  }
}
