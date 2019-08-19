import {Controller, Post} from "../../../../packages/common/src/mvc/decorators";
import {CustomBodyParams} from "./filter-decorator";


@Controller("/")
export class MyController {

  @Post("/")
  save(@CustomBodyParams({}) payload: any) {
    console.log(payload);
  }
}
