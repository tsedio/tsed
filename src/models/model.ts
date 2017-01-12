import Metadata from "../metadata/metadata";
import {TABLE, COLUMN} from "../constants/metadata-keys";

export class Model {

    static table(): string {
        return Metadata.get(TABLE, this);
    }

    static columns(): string[] {

        return Object
            .getOwnPropertyNames(this.mappings())
            .map(name => `${this.table()}.${this.mappings()[name]} AS '${this.column(name)}'`);
    }

    static column(property: string): string {
        return `${this.table()}.${property}`;
    }

    static mappings(): any {

        return Metadata.get(COLUMN, this);
    }

    static mappingsReverse(): any {

        return Object.getOwnPropertyNames(this.mappings()).reduce((ret: any, key: string) => {
            ret[this.mappings()[key]] = key;
            return ret;
        }, {});
    }

    static fromDB(data: any): Model {
        const instance = new this();
        for (let property in data) {
            if (data.hasOwnProperty(property)) {

                const value = data[property];
                const key = property.split(`${this.table()}.`)[1];

                if (typeof key !== 'undefined') {
                    console.log(key);
                    instance[key] = value;
                }

            }
        }

        return instance;
    }

}
