import {Controller} from "@tsed/di";
import {AcceptMime, Get} from "@tsed/schema";

@Controller("/mypath")
export class MyCtrl {
  @Get("/")
  @AcceptMime("application/json")
  public getResource() {
  }
}
