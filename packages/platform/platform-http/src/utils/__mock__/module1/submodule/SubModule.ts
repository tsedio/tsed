import {Module} from "../../../../../../../di/src/index.js";
import {SubService} from "./SubService.js";

@Module({
  imports: [SubService]
})
export class SubModule {}
