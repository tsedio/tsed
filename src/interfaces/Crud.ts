import * as Express from 'express';
import {IPromise} from "./Promise";

export interface ICrud<T> {
    /**
     * Find one element in databse
     * @param request
     * @param response
     * @param next
     */
    find(request: Express.Request, response: Express.Response, next?: Function): IPromise<T> | T | void;
    find(...args): IPromise<T> | T | void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    save(request: Express.Request, response: Express.Response, next?: Function): IPromise<T> | T | void;
    save(...args): IPromise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    update(request: Express.Request, response: Express.Response, next?: Function): IPromise<T> | T | void;
    update(...args): IPromise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    query(request: Express.Request, response: Express.Response, next?: Function): IPromise<T[]> | T[] | void;
    query(...args): IPromise<T[]>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    remove(request: Express.Request, response: Express.Response, next?: Function): IPromise<any> | any | void;
    remove(...args): IPromise<any>| any | void;
}