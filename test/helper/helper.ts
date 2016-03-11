import Promise = require("bluebird");
import {BadRequest} from "httpexceptions/lib/badrequest";
import {BodyParams} from "../../index";
import {CookiesParams} from "../../index";
import {Response} from "../../index";
import {Request} from "../../index";
import {Next} from "../../index";
import {QueryParams} from "../../index";
import {PathParams} from "../../index";
import {Controller} from "../../index";
import {Use} from "../../index";
import {Params} from "../../index";
import {Get} from "../../index";
import {Post} from "../../index";
import {Put} from "../../index";
import {Delete} from "../../index";
import {Head} from "../../index";
import {Patch} from "../../index";
import {All} from "../../index";
import {Authenticated} from "../../index";

export class TestRouter {

    _get: number = 0;
    _post: boolean;
    _put: boolean;
    _delete: boolean;
    _use: boolean;
    _auth: boolean;
    _param: boolean;
    _head: boolean;

    get(): void {
        this._get++;
    }

    post(): void {
        this._post = true;
    }

    use(): void {
        this._use = true;
    }

    auth(): void {
        this._auth = true;
    }

    put(): void {
        this._put = true;
    }

    delete(): void {
        this._delete = true;
    }

    param(): void {
        this._param = true;
    }

    head(): void {
        this._head = true;
    }
}


export class TestParamsRequiredFactory {
    middlewares: any;
    called: boolean = false;

    myMethod(@BodyParams("test") request, response, next): void {
        this.called = true;
    }
}


export class TestPromisify {
    middlewares: any;
    called: boolean = false;

    myMethod(request, response, next): void {
        this.called = true;
    }

    myMethodReturnValue(request, response, next): any {
        this.called = true;

        return {data: "yes", _id: 1};
    }

    myMethodPromised(request, response, next): Promise<any> {
        this.called = true;

        return new Promise(function(resolve, reject){

            resolve({data: "yes", _id: 1});

        });
    }

    myMethodThrowException(): void {
        this.called = true;

        throw new BadRequest("test");
    }
}

export class TestResponse {
    _status: number;
    _location: string;
    _json: any;
    _headers: string = "";

    public status(value: number) {
        this._status = value;
        return this;
    }

    public location(value: string) {
        this._location = value;
        return this;
    }

    public json(value: any) {
        this._json = value;
        return this;
    }

    public setHeader(key, value): TestResponse {
        this._headers += `${key}:${value}\n`;
        return this;
    }
}

export class TestParams {

    public name: string;
    public value: string;
    public response: any;
    public request: any;
    public next: Function;

    public getParams(
        @Params("body", "test") name: string,
        @Params("body", "obj.test") value: string,
        @Response() response: any,
        @Request() request: any,
        @Next() next: Function
    ): void {
        this.name = name;
        this.value = value;
        this.response = response;
        this.request = request;
        this.next = next;
    }

    public getCookies(
        @CookiesParams("test") name: string,
        @CookiesParams("obj.test") value: string,
        @Response() response: any,
        @Request() request: any,
        @Next() next: Function
    ): void {
        this.name = name;
        this.value = value;
        this.response = response;
        this.request = request;
        this.next = next;
    }

    public getBodyParams(
        @BodyParams("test") name: string,
        @BodyParams("obj.test") value: string,
        @Response() response: any,
        @Request() request: any,
        @Next() next: Function
    ): void {
        this.name = name;
        this.value = value;
        this.response = response;
        this.request = request;
        this.next = next;
    }

    public getPathParams(
        @PathParams("test") name: string,
        @PathParams("obj.test") value: string,
        @Response() response: any,
        @Request() request: any,
        @Next() next: Function
    ): void {
        this.name = name;
        this.value = value;
        this.response = response;
        this.request = request;
        this.next = next;
    }

    public getQueryParams(
        @QueryParams("test") name: string,
        @QueryParams("obj.test") value: string,
        @Response() response: any,
        @Request() request: any,
        @Next() next: Function
    ): void {
        this.name = name;
        this.value = value;
        this.response = response;
        this.request = request;
        this.next = next;
    }
}

export class TestRequest {
    public cookies: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };

    public body: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };

    public query: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };

    public params: any = {
        test: "testValue",
        obj: {
            test: "testValue"
        }
    };
}

export function TestUse(){}

@Controller("/rest")
export class TestVerbMethod {

    @Use()
    use1(): void {

    }

    @Use(TestUse)
    use2(): void {

    }
}

export function Middleware(){}

@Controller('/admin')
export class TestAdmin {

}

@Controller("/route", TestAdmin)
export class TestController {


    @Use()
    useGlobal(): void {

    }

    @Use("get")
    useGetGlobal(): void {

    }

    @Use("/test")
    useAsMiddleware(): void {

    }

    @Use(/^\/commits\/(\w+)(?:\.\.(\w+))?$/)
    useAsMiddleware2(): void {

    }

    @Use("get", "/test")
    useGet(): void {

    }

    @Use("get", "/test")
    @Use(Middleware)
    useGetAndMdl(): void {

    }
}

@Controller('/annotation')
export class TestAnnotation {

    @Get('/get', Middleware)
    @Authenticated()
    public get() {

    }

    @All('/all', Middleware)
    public all() {

    }

    @Post('/post', Middleware)
    public post() {

    }

    @Put('/put', Middleware)
    public put() {

    }

    @Delete('/delete', Middleware)
    public delete() {

    }

    @Head('/head', Middleware)
    public head() {

    }

    @Patch('/patch', Middleware)
    public patch() {

    }
}