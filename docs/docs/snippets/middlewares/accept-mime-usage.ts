import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {AcceptMime} from "@tsed/common";

@Controller("/mypath")
export class MyCtrl {
  @Get("/")
  @AcceptMime("application/json")
  public getResource() {}
}
