import {Controller} from "@tsed/di";
import {Get, Hidden} from "@tsed/schema";

@Hidden()
@Controller("/features")
export class FeatureController {
  @Get("/")
  get() {
    return "From feature";
  }
}
