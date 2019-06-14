import {Controller, Get, Next, Use, UseAfter, UseBefore, UseBeforeEach} from "@tsed/common";

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
