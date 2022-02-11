import {Controller} from "@tsed/di";
import {Get, Returns, Security} from "@tsed/schema";
import {UseAuth} from "@tsed/platform-middlewares";
import {Forbidden, Unauthorized} from "@tsed/exceptions";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

@Controller("/dashboard")
@UseAuth(CustomAuthMiddleware, {role: "admin"}) // on class level for all endpoints
@Security("oauth2", "email", "firstname")
class DashboardCtrl {
  @Get("/")
  @UseAuth(CustomAuthMiddleware, {role: "admin"}) // or for specific endpoints
  @Security("oauth2", "email", "firstname")
  @Returns(401, Unauthorized).Description("Unauthorized")
  @Returns(403, Forbidden).Description("Forbidden")
  public getResource() {}
}
