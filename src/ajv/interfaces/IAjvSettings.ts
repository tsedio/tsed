/**
 * @module ajv
 */
/** */

declare interface IServerSettings {
    ajv: IAjvSettings;
}

export type ErrorFormatter = (error: any) => string;

export interface IAjvSettings {
    errorFormat?: ErrorFormatter;

    options?: IAjvOptions;
}

export interface IAjvOptions {
    verbose?: boolean;
}