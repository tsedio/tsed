import {Controller, Get, Next, Use, UseAfter, UseBefore} from "@tsed/common";

@Controller("/")
@UseAfter(MdlwCtrlAfter)
@UseBefore(MdlwCtrlBefore)
@Use(MdlwCtrl)
export class MyCtrl {

  @Get("/")
  @UseAfter(MdlwAfter)
  @Use(Mdlw)
  @UseBefore(MdlwBefore)
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
