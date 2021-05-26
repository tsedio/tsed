import {Injectable, PipeMethods} from "@tsed/common";

/**
 * @ignore
 */
@Injectable()
export class ParseApiGatewayPipe implements PipeMethods {
  transform(value: string): any {
    return JSON.parse(decodeURIComponent(value));
  }
}
