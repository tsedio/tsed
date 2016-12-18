import {IConverter} from '../interfaces/Converter';
import {Converter} from '../decorators/converter';

@Converter(Date)
export class DateConverter implements IConverter {

    deserialize(data: string): Date {
        return new Date(data);
    }

    serialize(object: Date): any {
        return object.toISOString();
    }
}