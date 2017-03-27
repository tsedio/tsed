import {IConverter} from "../interfaces";
import {Converter} from "../decorators/class/converter";

@Converter(Date)
export class DateConverter implements IConverter {

    deserialize(data: string): Date {
        return new Date(data);
    }

    serialize(object: Date): any {
        return object.toISOString();
    }
}