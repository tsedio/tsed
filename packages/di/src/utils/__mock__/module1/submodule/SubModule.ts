import {Module} from "@tsed/di";
import {SubService} from "./SubService";

@Module({
  imports: [SubService]
})
export class SubModule {}
