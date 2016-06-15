
import {IPromise} from "./Promise";

export interface ICrud<T> {
    /**
     * Find one element in databse
     * @param request
     * @param response
     * @param next
     */
    find(request: Express.Request, response: Express.Response, next?: Function): IPromise<T> | void;
    find(...args): IPromise<T> | void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    save(request: Express.Request, response: Express.Response, next?: Function): IPromise<T>|void;
    save(...args): IPromise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    update(request: Express.Request, response: Express.Response, next?: Function): IPromise<T>|void;
    update(...args): IPromise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    query(request: Express.Request, response: Express.Response, next?: Function): IPromise<T[]>|void;
    query(...args): IPromise<T[]>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    remove(request: Express.Request, response: Express.Response, next?: Function): IPromise<any>|void;
    remove(...args): IPromise<any>|void;
}