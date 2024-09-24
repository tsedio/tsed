import {Module} from "@tsed/di";

import {SubService} from "./SubService.js";

@Module({
  imports: [SubService]
})
export class SubModule {}
