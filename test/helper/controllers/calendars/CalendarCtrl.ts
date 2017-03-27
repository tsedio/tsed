import {
    Controller, Get, Post, Put, Delete,
    PathParams, Request, Response,
    BodyParams, Required, Use, Header, Next, Authenticated,
    CookiesParams, QueryParams,
    RouterController
} from "../../../../src/index";

import {$log} from "ts-log-debug";
import * as Express from "express";
import {EventCtrl} from "./EventCtrl";
import {MongooseService} from "../../services/MongooseService"
import {ContentType} from "../../../../src/decorators/method/content-type";
import {UseAfter} from "../../../../src/decorators/method/use-after";
import {Status} from "../../../../src/decorators/method/status";
import {MultipartFile} from "../../../../src/decorators/param/multipart-file";
import {Locals} from "../../../../src/decorators/param/params";

interface ICalendar {
    id: string;
    name: string;
}
/**
 * Add @Controller annotation to declare your class as Router controller. The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventCtrl is a depedency of CalendarCtrl. All routes of EventCtrl will be mounted on the `/calendars` path.
 */
@Controller("/calendars", EventCtrl)
export class CalendarCtrl {

    constructor(
        private mongooseService: MongooseService,
        private routerController: RouterController
    ) {

        //
        const router = this.routerController.getRouter();
        
    }
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

    @Get("/token")
    public getToken(
        @CookiesParams("authorization") authorization: string
    ): string {

        if (authorization){
            const token = this.mongooseService.token();
            return token;
            //console.log('TOKEN', this.mongooseService, token);
        }

        return "";
    }

    @Get("/token/:token")
    public updateToken(
        @PathParams("token") token: string
    ): string {
        this.mongooseService.token(token);
        return 'token updated';
    }


    @Get("/query")
    public getQuery(
        @QueryParams("search") search: string,
        @Request() request
    ): string {

        return search || "EMPTY";
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
    ): Promise<ICalendar> {

        $log.debug("ID =>", id, request.params.id);

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
    ): Promise<ICalendar> {

        //$log.debug("ID =>", id, request.params.id);
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
    @Authenticated({role: "admin"})
    public remove(
        @BodyParams("id") @Required() id: string
    ): any {
        return {id: id, name: "test"};
    }

    @Get('/middlewares')
    @Authenticated()
    @Use(CalendarCtrl.middleware)
    public testStackMiddlewares (
        @Request() request: Express.Request
    ) {
        return {id: request['user'], name: "test"};
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static middleware(request: Express.Request, response: Express.Response, next: Express.NextFunction) {

        request['user'] = 1;

        //console.log(request.headers)
        next();
    }

    @Get('/middlewares2')
    @Authenticated()
    @UseAfter(CalendarCtrl.middleware2)
    public testUseAfter (
        @Request() request: Express.Request,
        @Locals() locals: any
    ): Object {
        return {id: 1, name: "test"};
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static middleware2(request: Express.Request, response: Express.Response, next: Express.NextFunction) {

        request.getStoredData().uuid = 10909;

        //console.log(request.headers)
        next();
    }

    /**
     * Test the Header decorator.
     * @param request
     * @returns {{id: any, name: string}}
     */
    @Get('/headers')
    @Header('x-token-test', 'test')
    @Header('x-token-test-2', 'test2')
    @Status(200)
    @ContentType('application/xml')
    testResponseHeader (
        @Request() request: Express.Request
    ) {
        return "<xml></xml>";
    }

    @Post('/documents')
    testMultipart(
        @MultipartFile() files: any[]
    ){
        console.log(files);
        return files;
    }


    @Post('/documents/1')
    testMultipart2(
        @MultipartFile() file: any
    ){
        console.log(file);
        return file;
    }
}