import * as Express from "express";

export interface ICrud<T> {
    /**
     * Find one element in databse
     * @param request
     * @param response
     * @param next
     */
    find(request: Express.Request, response: Express.Response, next?: Function): Promise<T> | T | void;
    find(...args): Promise<T> | T | void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    save(request: Express.Request, response: Express.Response, next?: Function): Promise<T> | T | void;
    save(...args): Promise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    update(request: Express.Request, response: Express.Response, next?: Function): Promise<T> | T | void;
    update(...args): Promise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    query(request: Express.Request, response: Express.Response, next?: Function): Promise<T[]> | T[] | void;
    query(...args): Promise<T[]>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    remove(request: Express.Request, response: Express.Response, next?: Function): Promise<any> | any | void;
    remove(...args): Promise<any>| any | void;
}