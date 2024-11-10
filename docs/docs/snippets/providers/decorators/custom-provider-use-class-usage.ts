import {Injectable, Inject} from "@tsed/di";
import {ConfigService} from "./ConfigService.js";

@Injectable()
export class MyService {
  constructor(@Inject(ConfigService) configService: ConfigService) {
    console.log(process.env.NODE_ENV, configService); // DevConfigService or ConfigService
  }
}
