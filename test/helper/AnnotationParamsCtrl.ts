
import {Params, Response, Request, Next, CookiesParams, BodyParams, PathParams, QueryParams} from "../../index";

export class AnnotationParamsCtrl {

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
