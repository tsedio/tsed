import {Controller, Get, UseAuth} from "@tsed/common";
import {Unauthorized, Forbidden} from "@tsed/exceptions";
import {} from "@tsed/swagger";
import {Returns, Security} from "@tsed/schema";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

@Controller("/dashboard")
@UseAuth(CustomAuthMiddleware, {role: "admin"}) // on class level for all endpoints
@Security("oauth2", "email", "firstname")
class DashboardCtrl {
  @Get("/")
  @UseAuth(CustomAuthMiddleware, {role: "admin"}) // or for specific endpoints
  @Security("oauth2", "email", "firstname")
  @Returns(401, Unauthorized).Description("Unauthorized")
  @Returns(403, Forbidden).Description('Forbidden')
  public getResource() {
  }
}
