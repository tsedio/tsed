import {AfterRoutesInit, ExpressApplication, Module} from "@tsed/common";
import {ValidationErrorMiddleware} from "./middlewares/ValidationErrorMiddleware";
import {MONGOOSE_CONNECTIONS} from "./services/MongooseConnections";
import {MongooseService} from "./services/MongooseService";

@Module({
  imports: [MONGOOSE_CONNECTIONS]
})
export class MongooseModule implements AfterRoutesInit {
  constructor(@ExpressApplication private expressApp: ExpressApplication, private mongooseService: MongooseService) {}

  $afterRoutesInit(): void {
    this.expressApp.use(ValidationErrorMiddleware as any);
  }

  $onDestroy(): Promise<any> | void {
    return this.mongooseService.closeConnections();
  }
}
