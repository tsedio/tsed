import {Inject, Injectable} from "@tsed/di";
import {ConfigService} from "./ConfigService.js";

@Injectable()
export class MyService {
  constructor(@Inject(ConfigService) configService: ConfigService) {
    // The injected service will be:
    // - DevConfigService when NODE_ENV === "development"
    // - ConfigService otherwise
    const currentConfig = configService.get();
  }
}
