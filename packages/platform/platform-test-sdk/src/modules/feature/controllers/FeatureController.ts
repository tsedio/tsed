import {Controller} from "@tsed/di";
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
