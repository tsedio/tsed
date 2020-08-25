import {Controller, Get} from "@tsed/common";
import {Hidden} from "@tsed/swagger";

@Hidden()
@Controller("/features")
export class FeatureController {
  @Get("/")
  get() {
    return "From feature";
  }
}
