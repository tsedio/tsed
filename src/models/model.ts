import Metadata from "../metadata/metadata";
import {TABLE, COLUMN} from "../constants/metadata-keys";

export class Model {

    static table(): string {
        return Metadata.get(TABLE, this);
    }

    static columns(): string[] {

        return Object
            .getOwnPropertyNames(this.mappings())
            .map(name => `${this.table()}.${this.mappings()[name]}`);
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
                const key = this.mappingsReverse()[property];
                instance[key] = value;
            }
        }

        return instance;
    }

}
