import {Controller, Get} from "@tsed/common";
import {MySocketService} from "../services/MySocketService";

@Controller("/")
export class MyCtrl {

  constructor(private mySocketService: MySocketService) {

  }

  @Get("/allo")
  allo() {
    this.mySocketService.helloAll();

    return "is sent";
  }
}
