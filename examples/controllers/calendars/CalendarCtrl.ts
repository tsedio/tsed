import {Controller, Get, Post, Put, Delete, PathParams, Request, Response} from "../../../index";
import * as Logger from "log-debug";
import {IPromise} from "../../../icrud";
import {BodyParams} from "../../../lib/params";
import * as Promise from "bluebird";
import * as Express from "express";

interface ICalendar{
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
    @Get('/classic/:id')
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
     * @returns {{id: any, name: string}}
     */
    @Get('/annotation/test/:id')
    public findWithAnnotation(
        @Request() request,
        @PathParams('id') id
    ): ICalendar {

        Logger.debug('ID =>', id, request.params.id);

        return {id: id, name: "test"};
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
    @Get('/annotation/promised/:id')
    public findWithPromise(
        @Request() request,
        @PathParams('id') id
    ): IPromise<ICalendar> {

        Logger.debug('ID =>', id, request.params.id);

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
    @Get('/annotation/status/:id')
    public findAndChangeStatusCode(
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @PathParams('id') id: string
    ): IPromise<ICalendar> {

        Logger.debug('ID =>', id, request.params.id);
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
     * @param name
     * @returns {{id: number, name: string}}
     */
    
    @Put('/')
    public save(
        @Request() request,
        @BodyParams('name') name: string
    ): any {

        return {id: 2, name: name};
    }

    /**
     * 
     * @returns {null}
     */
    @Post('/:id')
    public update(

    ): IPromise<any> | void {


        return null;
    }

    /**
     * 
     * @returns {null}
     */
    @Delete('/:id')
    public remove(

    ): IPromise<any> | void {
        return null;
    }

    /**
     * 
     * @returns {null}
     */
    @Get('/')
    public query(

    ): IPromise<any[]> | void {

        return null;
    }
}