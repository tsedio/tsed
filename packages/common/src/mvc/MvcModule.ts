import {Module} from "@tsed/di";
import {ConverterService} from "./services/ConverterService";
import {ParseService} from "./services/ParseService";
import {ValidationService} from "./services/ValidationService";

@Module({
  imports: [ConverterService, ParseService, ValidationService]
})
export class MvcModule {}
