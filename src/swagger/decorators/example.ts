/**
 * @module swagger
 */
/** */
import {Schema} from "./schema";

export function Example(name: string, description: string) {
    return (...args) => {
        return Schema({example: {[name]: description}})(...args);
    };
}