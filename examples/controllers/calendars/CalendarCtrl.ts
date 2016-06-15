import {
    Controller, Get, Post, Put, Delete,
    PathParams, Request, Response,
    BodyParams, Required, Use, Header, Next, Authenticated
} from "../../../index";

import * as Logger from "log-debug";
import * as Promise from "bluebird";
import * as Express from "express";
import {IPromise} from "../../../interfaces/promise";

interface ICalendar {
    id: string;
    name: string;
}
/**
 * Add @Controller annotation to declare your class as Router controller. The first param is the global path for your controller.
 * The others params is the controller depedencies.
 *
 * In this case, EventCtrl is a depedency of CalendarCtrl. All routes of EventCtrl will be mounted on the `/calendars` path.
 */
@Controller("/calendars", "EventCtrl")
export class CalendarCtrl {

    /**
     * Example of classic call. Use `@Get` for routing a request to your method.
     * In this case, this route "/calendar/classic/:id" are mounted on the "rest/" path (call /rest/calendar/classic/:id
     * to test your service).
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param request
     * @param response
     * @returns {{id: any, name: string}}
     */
    @Get("/classic/:id")
    public findClassic(request: any, response: any): ICalendar {

        return {id: request.params.id, name: "test"};
    }

    /**
     * Example of customised call. You can use decorators to inject express object like `response` as `@Response`,
     * `request` as `@Request` and `next` as `@Next`.
     *
     * Another decorator are available to access quickly to the pathParams request. `@PathParams` take an expression in
     * first parameter.
     *
     * @param request
     * @param id
     * @param next
     * @param response
     * @returns {{id: any, name: string}}
     */

    @Get("/annotation/test/:id")
    public findWithAnnotation(
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @PathParams("id") @Required() id: string,
        @Next() next: Express.NextFunction
    ): void {

        response.status(200).json({id: id, name: "test"});

        next();
    }

    /**
     * Your method can return a Promise to respond to a request.
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param request
     * @param id
     * @returns {Promise<ICalendar>}
     */
    @Get("/annotation/promised/:id")
    public findWithPromise(
        @Request() request,
        @PathParams("id") id
    ): IPromise<ICalendar> {

        Logger.debug("ID =>", id, request.params.id);

        //
        return new Promise<ICalendar>((resolve, reject) => {


            resolve({
                id: id,
                name: "test"
            });
        });
    }

    /**
     * Your method can return a Promise to respond to a request.
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param request Express request
     * @param response Express response
     * @param id
     * @returns {Promise<ICalendar>}
     */
    @Get("/annotation/status/:id")
    public findAndChangeStatusCode(
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @PathParams("id") id: string
    ): IPromise<ICalendar> {

        Logger.debug("ID =>", id, request.params.id);
        //
        return new Promise<ICalendar>((resolve, reject) => {

            response.status(202);

            resolve({
                id: id,
                name: "test"
            });
        });
    }

    /**
     *
     * @param request
     * @returns {{user: (number|any|string)}}
     */
    @Get("/middleware")
    @Use(CalendarCtrl.middleware)
    public getWithMiddleware(
        @Request() request,
        @Header("authorization") auth: string
    ): any {

        return {
            user: request.user,
            token: auth
        };
    }

    /**
     *
     * @param auth
     * @param name
     * @returns {{id: number, name: string}}
     */
    @Put("/")
    public save(
        @BodyParams("name") @Required() name: string
    ): any {

        return {id: 2, name: name};
    }


    @Delete("/")
    @Authenticated()
    public remove(
        @BodyParams("id") @Required() id: string
    ): any {
        return {id: id, name: "test"};
    }

    static middleware(request: Express.Request, response: Express.Response, next: Express.NextFunction){

        request.user = 1;

        //console.log(request.headers)
        next();
    }
}