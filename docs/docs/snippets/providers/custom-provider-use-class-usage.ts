import {Injectable} from "@tsed/common";
import {ConfigService} from "./ConfigService";

@Injectable()
export class MyService {
  constructor(configService: ConfigService) {
    console.log(process.env.NODE_ENV, configService); // DevConfigService or ConfigService
  }
}
