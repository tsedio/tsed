import * as Express from "express";
import {
    Authenticated,
    BodyParams,
    ContentType,
    Controller,
    CookiesParams,
    Delete,
    Get,
    Header,
    Locals,
    PathParams,
    Post,
    Put,
    QueryParams,
    Request,
    Required,
    Response,
    RouterController,
    Status,
    Use,
    UseAfter
} from "../../../../../src";
import {HeaderParams} from "../../../../../src/filters/decorators/headerParams";
import {MultipartFile} from "../../../../../src/multipartfiles/decorators/multipartFile";
import {Deprecated} from "../../../../../src/swagger/decorators/deprecated";
import {Description} from "../../../../../src/swagger/decorators/description";
import {Returns} from "../../../../../src/swagger/decorators/returns";
import {Security} from "../../../../../src/swagger/decorators/security";
import {CalendarModel} from "../../models/Calendar";
import {MongooseService} from "../../services/MongooseService";
import {BaseController} from "../base/BaseController";
import {EventCtrl} from "./EventCtrl";

interface ICalendar {
    id: string;
    name: string;
}

/**
 * Add @ControllerProvider annotation to declare your provide as Router controller. The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventCtrl is a depedency of CalendarCtrl. All routes of EventCtrl will be mounted on the `/calendars` path.
 */
@Controller("/calendars", EventCtrl)
export class CalendarCtrl extends BaseController {

    constructor(private mongooseService: MongooseService,
                private routerController: RouterController) {

        super(mongooseService);
        const router = this.routerController.getRouter();

    }

    /**
     * Example of classic call. Use `@Get` for routing a request to your method.
     * In this case, this route "/calendar/classic/:id" are mounted on the "integration/" path (call /integration/calendar/classic/:id
     * to test your service).
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param request
     * @param response
     * @returns {{id: any, name: string}}
     */
    @Get("/classic/:id")
    public findClassic(request: any, response: any): CalendarModel {
        const model = new CalendarModel();
        model.id = request.params.id;
        model.name = "test";
        return model;
    }

    @Get("/token")
    public getToken(@CookiesParams("authorization") authorization: string): string {

        if (authorization) {
            const token = this.mongooseService.token();
            return token;
            // console.log('TOKEN', this.mongooseService, token);
        }

        return "";
    }

    @Get("/token/:token")
    public updateToken(@PathParams("token") @Description("Token required to update token") token: string): string {
        this.mongooseService.token(token);
        return "token updated";
    }


    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static middleware(request: any, response: Express.Response, next: Express.NextFunction) {

        request["user"] = 1;

        // console.log(request.headers)
        next();
    }

    /**
     * Example of customised call. You can use decorators to inject express object like `response` as `@Response`,
     * `request` as `@Request` and `next` as `@Next`.
     *
     * Another decorators are available to access quickly to the pathParams request. `@PathParamsType` take an expression in
     * first parameter.
     *
     * @param request
     * @param id
     * @param next
     * @param response
     * @returns {{id: any, name: string}}
     */

    @Get("/annotation/test/:id")
    public findWithAnnotation(@Response() response: Express.Response,
                              @PathParams("id") @Required() id: string): void {

        const model = new CalendarModel();
        model.id = "1";
        model.name = "test";

        response.status(200).json(model);
    }

    /**
     * Your method can return a Promise to respond to a request.
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param id
     * @returns {Promise<ICalendar>}
     */
    @Get("/annotation/promised/:id")
    public findWithPromise(@PathParams("id") id: string): Promise<ICalendar> {
        //
        const model = new CalendarModel();
        model.id = id;
        model.name = "test";

        return new Promise<ICalendar>((resolve, reject) => {
            resolve(model);
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
    public findAndChangeStatusCode(@Request() request: Express.Request,
                                   @Response() response: Express.Response,
                                   @PathParams("id") id: string): Promise<ICalendar> {

        const model = new CalendarModel();
        model.id = id;
        model.name = "test";

        return new Promise<ICalendar>((resolve, reject) => {

            response.status(202);

            resolve(model);
        });
    }

    @Get("/query")
    public getQuery(@QueryParams("search") search: string,
                    @Request() request: any): string {

        return search || "EMPTY";
    }

    /**
     *
     * @param auth
     * @param name
     * @returns {{id: number, name: string}}
     */
    @Put("/")
    @Returns(CalendarModel)
    public save(@BodyParams("name") @Required() name: string): CalendarModel {
        const model = new CalendarModel();
        model.id = "2";
        model.name = "test";

        return model;
    }


    @Delete("/")
    @Authenticated({role: "admin"})
    @Security("global_auth", "read:global")
    @Security("calendar_auth", "write:calendar", "read:calendar")
    public remove(@BodyParams("id") @Required() id: string): CalendarModel {
        const model = new CalendarModel();
        model.id = id;
        model.name = "test";
        return model;
    }

    /**
     *
     * @param request
     * @param auth
     * @returns {{user: (number|any|string)}}
     */
    @Get("/middleware")
    @Use(CalendarCtrl.middleware)
    public getWithMiddleware(@Request() request: any,
                             @HeaderParams("authorization") auth: string): any {

        return {
            user: request.user,
            token: auth
        };
    }

    @Get("/mvc")
    @Authenticated()
    @Use(CalendarCtrl.middleware)
    public testStackMiddlewares(@Request() request: any): CalendarModel {

        const model = new CalendarModel();
        model.id = request["user"];
        model.name = "test";

        return model;
    }

    @Get("/middlewares2")
    @Authenticated()
    @UseAfter(CalendarCtrl.middleware2)
    public testUseAfter(@Request() request: any,
                        @Locals() locals: any): Object {

        const model = new CalendarModel();
        model.id = request["user"];
        model.name = "test";

        return model;
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static middleware2(request: Express.Request, response: Express.Response, next: Express.NextFunction) {

        request.getStoredData().id = 10909;

        // console.log(request.headers)
        next();
    }

    /**
     * Test the Header decorators.
     * @param request
     * @returns {{id: any, name: string}}
     */
    @Get("/headers")
    @Header("x-token-test", "test")
    @Header("x-token-test-2", "test2")
    @Status(200)
    @ContentType("application/xml")
    @Deprecated()
    testResponseHeader(@Request() request: Express.Request) {
        return "<xml></xml>";
    }

    @Post("/documents")
    testMultipart(@MultipartFile() files: any[]) {
        return files;
    }


    @Post("/documents/1")
    testMultipart2(@MultipartFile() file: any) {
        return file;
    }
}