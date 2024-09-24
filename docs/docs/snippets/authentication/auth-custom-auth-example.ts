import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

import {CustomAuth} from "../decorators/CustomAuth";

@Controller("/dashboard")
@CustomAuth({role: "admin", scopes: ["email", "firstname"]})
class DashboardCtrl {
  @Get("/")
  @CustomAuth({role: "admin", scopes: ["email", "firstname"]})
  public getResource() {}
}
