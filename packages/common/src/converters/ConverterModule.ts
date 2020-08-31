import {Module} from "@tsed/di";
import {ConverterService} from "./services/ConverterService";

@Module({
  imports: [ConverterService]
})
export class ConverterModule {}
