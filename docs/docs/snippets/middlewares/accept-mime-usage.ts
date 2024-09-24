import {AcceptMime} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/mypath")
export class MyCtrl {
  @Get("/")
  @AcceptMime("application/json")
  public getResource() {}
}
