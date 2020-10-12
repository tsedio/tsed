import {getValue, isEmpty} from "@tsed/core";
import {Injectable} from "@tsed/di";

@Injectable()
export class ParseService {
  static clone = (src: any): any => JSON.parse(JSON.stringify(src));

  eval(expression: string, scope: any, clone: boolean = true): any {
    if (isEmpty(expression)) {
      return typeof scope === "object" && clone ? ParseService.clone(scope) : scope;
    }

    const value = getValue(scope, expression);

    return typeof value === "object" && clone ? ParseService.clone(value) : value;
  }
}
