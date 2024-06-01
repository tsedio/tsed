import {Module} from "../../../../decorators/module.js";
import {SubService} from "./SubService.js";

@Module({
  imports: [SubService]
})
export class SubModule {}
