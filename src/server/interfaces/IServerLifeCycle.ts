/**
 * @module common/server
 */
/** */
import * as Express from "express";

/**
 * ServerLoader lifecycle let you intercept a phase.
 */
export interface IServerLifecycle {
    version: any;

    /**
     * This method is called when the server starting his lifecycle.
     */
    $onInit?(): void | Promise<any>;

    $onMountingMiddlewares?: Function;
    $afterRoutesInit?: Function;
    $onReady?: Function;

    $onServerInitError?(error: any): any;

    /**
     * @deprecated
     * @param {e.Request} request
     * @param {e.Response} response
     * @param {e.NextFunction} next
     * @param authorization
     * @returns {boolean | void}
     */
    $onAuth?(request: Express.Request, response: Express.Response, next?: Express.NextFunction, authorization?: any): boolean | void;

    /**
     * @deprecated
     * @returns {boolean | void}
     */
    $onAuth?(): boolean | void;
}