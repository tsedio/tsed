/**
 * @module swagger
 */
/** */
import {Schema} from "./schema";

export function Title(title: string) {
    return (...args: any[]) => {
        return Schema({title})(...args);
    };
}