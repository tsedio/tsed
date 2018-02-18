import {Service} from "../../di/decorators/service";

@Service()
export class ValidationService {
    public validate(obj: any, targetType: any, baseType?: any): boolean {
        return true;
    }
}