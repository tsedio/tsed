import Metadata from "../metadata/metadata";
import {TABLE, COLUMN} from "../constants/metadata-keys";

export abstract class Model {

    static table(): string {
        return Metadata.get(TABLE, this);
    }

    static columns(): string[] {

        const columns = Metadata.get(COLUMN, this);
        return Object.getOwnPropertyNames(columns).map(name => `${this.table()}.${columns[name]}`);
    }

}
