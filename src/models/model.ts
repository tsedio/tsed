import Metadata from "../metadata/metadata";
import {TABLE, COLUMN} from "../constants/metadata-keys";

export abstract class Model {

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

}
