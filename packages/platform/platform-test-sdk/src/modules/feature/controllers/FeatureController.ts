import {Controller} from "@tsed/common";
import {Get} from "@tsed/schema";
import {Hidden} from "@tsed/swagger";

@Hidden()
@Controller("/features")
export class FeatureController {
  @Get("/")
  get() {
    return "From feature";
  }
}
