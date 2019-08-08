import {Service} from "@tsed/di";

@Service()
export class ValidationService {
  public validate(obj: any, targetType: any, baseType?: any): boolean {
    return true;
  }
}
