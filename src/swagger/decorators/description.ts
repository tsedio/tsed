/**
 * @module swagger
 */
/** */
import {Schema} from "./schema";

export function Description(description: string) {
    return (...args: any[]) => {
        return Schema({description})(...args);
    };
}