import {Module} from "@tsed/di";
import {ConverterService} from "./services/ConverterService";
import {ValidationService} from "./services/ValidationService";

@Module({
  imports: [ConverterService, ValidationService]
})
export class MvcModule {}
