/**
 * @module swagger
 */
/** */
import {Schema} from "./schema";

export function Description(description: string) {
    return (...args) => {
        return Schema({description})(...args);
    };
}