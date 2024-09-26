import {Configuration, Inject, Module, type OnDestroy, type OnInit} from "@tsed/di";

import {MONGOOSE_CONNECTIONS} from "./services/MongooseConnections.js";
import {MongooseService} from "./services/MongooseService.js";

/**
 * @ignore
 */
@Module({
  imports: [MONGOOSE_CONNECTIONS]
})
export class MongooseModule implements OnDestroy, OnInit {
  constructor(
    @Inject(MongooseService) private mongooseService: MongooseService,
    @Configuration() private settings: Configuration
  ) {
    // auto configure the cache manager when mongoose is used with @tsed/mongoose
    const cache = this.settings.get<any>("cache");

    // istanbul ignore next
    if (cache?.mongoose) {
      cache.connection = this.mongooseService.get();
    }
  }

  $onInit(): void | Promise<any> {}

  $onDestroy(): Promise<any> | void {
    return this.mongooseService.closeConnections();
  }
}
