import {Controller, Get} from "@tsed/common";
import {AcceptMime} from "@tsed/common/src/mvc/decorators/method/acceptMime";

@Controller("/mypath")
export class MyCtrl {
  @Get("/")
  @AcceptMime("application/json")
  public getResource() {
  }
}
