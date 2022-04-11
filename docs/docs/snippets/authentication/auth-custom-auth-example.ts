import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {CustomAuth} from "../decorators/CustomAuth";

@Controller("/dashboard")
@CustomAuth({role: "admin", scopes: ["email", "firstname"]})
class DashboardCtrl {
  @Get("/")
  @CustomAuth({role: "admin", scopes: ["email", "firstname"]})
  public getResource() {}
}
