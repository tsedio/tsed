import {Get, Hidden} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Hidden()
@Controller("/features")
export class FeatureController {
  @Get("/")
  get() {
    return "From feature";
  }
}
