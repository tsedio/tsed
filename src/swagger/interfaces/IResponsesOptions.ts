/**
 * @module swagger
 */
/** */

import {Header} from "swagger-schema-official";
import {Type} from "../../core/interfaces";

export interface IResponsesOptions {
    description?: string;
    use?: Type<any>;
    collection?: Type<any>;
    headers?: { [headerName: string]: Header };
}