import {CacheSettings, Configuration, OnInit} from "@tsed/common";
import {Module, OnDestroy} from "@tsed/di";
import {MONGOOSE_CONNECTIONS} from "./services/MongooseConnections";
import {MongooseService} from "./services/MongooseService";

/**
 * @ignore
 */
@Module({
  imports: [MONGOOSE_CONNECTIONS]
})
export class MongooseModule implements OnDestroy, OnInit {
  constructor(private mongooseService: MongooseService, @Configuration() private settings: Configuration) {
    // auto configure the cache manager when mongoose is used with @tsed/mongoose
    const cache = this.settings.get<CacheSettings>("cache");

    if (cache?.mongoose) {
      cache.connection = this.mongooseService.get();
    }
  }

  $onInit(): void | Promise<any> {}

  $onDestroy(): Promise<any> | void {
    return this.mongooseService.closeConnections();
  }
}
