/**
 * @module swagger
 */
/** */
import {Path} from "swagger-schema-official";

export interface ISwaggerPaths {
    [pathName: string]: Path;
}
