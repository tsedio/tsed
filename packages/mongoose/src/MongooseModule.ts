import {Inject, Module, OnDestroy} from "@tsed/common";
import {MONGOOSE_CONNECTIONS} from "./services/MongooseConnections";
import {MongooseService} from "./services/MongooseService";

/**
 * @ignore
 */
@Module({
  imports: [MONGOOSE_CONNECTIONS]
})
export class MongooseModule implements OnDestroy {
  @Inject()
  private mongooseService: MongooseService;

  $onDestroy(): Promise<any> | void {
    return this.mongooseService.closeConnections();
  }
}
