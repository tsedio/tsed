/**
 * @module swagger
 */
/** */
import {Schema} from "./schema";

export function Example(name: string, description: string) {
    return (...args: any[]) => {
        return Schema({example: {[name]: description}})(...args);
    };
}