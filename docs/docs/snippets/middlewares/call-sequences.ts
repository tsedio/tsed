import {Next} from "@tsed/common";
import {Use, UseAfter, UseBefore, UseBeforeEach} from "@tsed/platform-middlewares";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/")
@UseAfter(MdlwCtrlAfter)
@UseBefore(MdlwCtrlBefore)
@UseBeforeEach(MdlwCtrlBeforeEach)
@Use(MdlwCtrl)
export class MyCtrl {
  @Get("/")
  @UseBefore(MdlwBefore)
  @Use(Mdlw)
  @UseAfter(MdlwAfter)
  endpointA(@Next() next: Next) {
    console.log("EndpointA");
    next();
  }

  @Get("/")
  endpointB() {
    console.log("EndpointB");

    return {};
  }
}
