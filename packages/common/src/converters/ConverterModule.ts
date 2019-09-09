import {Module} from "@tsed/di";
import {ArrayConverter, DateConverter, MapConverter, PrimitiveConverter, SetConverter, SymbolConverter} from "./components";
import {ConverterService} from "./services/ConverterService";

@Module({
  imports: [ArrayConverter, DateConverter, MapConverter, PrimitiveConverter, SetConverter, SymbolConverter, ConverterService]
})
export class ConverterModule {}
