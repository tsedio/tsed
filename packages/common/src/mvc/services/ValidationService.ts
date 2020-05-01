import {Service} from "@tsed/di";

/**
 * @deprecated Use ValidationPipe instead
 */
@Service()
export class ValidationService {
  public validate(obj: any, targetType: any, baseType?: any): boolean {
    return true;
  }
}
