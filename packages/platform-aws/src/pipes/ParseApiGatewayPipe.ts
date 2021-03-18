import {Injectable, IPipe} from "@tsed/common";

/**
 * @ignore
 */
@Injectable()
export class ParseApiGatewayPipe implements IPipe {
  transform(value: string): any {
    return JSON.parse(decodeURIComponent(value));
  }
}
