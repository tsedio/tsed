import {Module} from "../../../../decorators/module";
import {SubService} from "./SubService";

@Module({
  imports: [SubService]
})
export class SubModule {}
