import Metadata from "../metadata/metadata";
import {TABLE, COLUMN} from "../constants/metadata-keys";

export class Model {

    static table(): string {
        return Metadata.get(TABLE, this);
    }

    static columns(options?: any): string[] {

        const defaultOptions = {
            prefix: false
        };

        const _options = Object.assign({}, defaultOptions, options);

        return Object
            .getOwnPropertyNames(this.mappings())
            .map(name => `${this.table()}.${this.mappings()[name]} AS '${this.column(name, _options)}'`);
    }

    static column(property: string, options?: any): string {

        const defaultOptions = {
            prefix: false
        };

        const _options = Object.assign({}, defaultOptions, options);

        const columnName = this.mappings()[property];

        if (typeof columnName !== 'undefined') {

            if (_options.prefix) {
                return `${this.table()}.${columnName}`;
            }

            return columnName;
        }
    }

    static fromDB<T extends Model>(data: any, options?: any): T {

        const defaultOptions = {
            prefix: false
        };

        const _options = Object.assign({}, defaultOptions, options);

        const instance = <T>new this();

        for (let column in data) {

            if (data.hasOwnProperty(column)) {

                const value = data[column];

                let key: string;

                if (_options.prefix) {

                    key = column.split(`${this.table()}.`)[1];

                } else {

                    key = column;
                }

                if (typeof key !== 'undefined') {

                    const property = this.mappingsReverse()[key];

                    if (typeof property !== 'undefined') {
                        instance[property] = value;
                    }
                }

            }

        }

        return instance;
    }

    /*
     * @returns
     *   "Class property" => "DB column"
     */
    static mappings(): any {

        return Metadata.get(COLUMN, this);
    }

    /*
     * @returns
     *   "DB column" => "Class property"
     */
    static mappingsReverse(): any {

        return Object.getOwnPropertyNames(this.mappings()).reduce((ret: any, key: string) => {
            ret[this.mappings()[key]] = key;
            return ret;
        }, {});
    }

}
