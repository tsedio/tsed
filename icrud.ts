export interface iPromise<T>{
    then<U>(onFulFill: (result: T) => void, onReject?: (err: any) => void): iPromise<T>;
}

export interface iCRUD<T>{
    /**
     * Find one element in databse
     * @param request
     * @param response
     * @param next
     */
    find(request:Express.Request, response:Express.Response, next?:Function):iPromise<T> | void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    save(request:Express.Request, response:Express.Response, next?:Function):iPromise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    update(request:Express.Request, response:Express.Response, next?:Function):iPromise<T>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    query(request:Express.Request, response:Express.Response, next?:Function):iPromise<T[]>|void;
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    remove(request:Express.Request, response:Express.Response, next?:Function):iPromise<any>|void;
}