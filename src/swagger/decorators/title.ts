/**
 * @module swagger
 */
/** */
import {Schema} from "./schema";

export function Title(title: string) {
    return (...args) => {
        return Schema({title})(...args);
    };
}