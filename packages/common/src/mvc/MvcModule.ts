import {Module} from "@tsed/di";
import {ConverterModule} from "../converters/ConverterModule";
import {ParseService} from "./services/ParseService";
import {ValidationService} from "./services/ValidationService";

@Module({
  imports: [ConverterModule, ParseService, ValidationService]
})
export class MvcModule {}
