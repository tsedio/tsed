import Metadata from "../metadata/metadata";
import {TABLE, COLUMN} from "../constants/metadata-keys";

export function Table(tableName: string) {

    return (target: any): void => {
        if (!Metadata.has(TABLE, target)) {
            Metadata.set(TABLE, tableName, target);
        }
    };
}

export function Column(columnName?: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        let mappings: any;

        const klass = target.constructor;

        if (Metadata.has(COLUMN, klass)) {
            mappings = Metadata.get(COLUMN, klass);
        } else {
            mappings = {};
        }

        mappings[targetKey] = columnName ? columnName : targetKey;

        Metadata.set(COLUMN, mappings, klass);

        return descriptor;
    };
}
