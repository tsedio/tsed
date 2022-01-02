import {Injectable} from "@tsed/common";
import {PipeMethods} from "@tsed/schema";

/**
 * @ignore
 */
@Injectable()
export class ParseApiGatewayPipe implements PipeMethods {
  transform(value: string): any {
    return JSON.parse(decodeURIComponent(value));
  }
}
