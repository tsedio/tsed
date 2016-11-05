import {BadRequest} from "ts-httpexceptions";
import {Request} from '../../src/decorators/request';
import {Next} from '../../src/decorators/next';
import {Response} from '../../src/decorators/response';
import {BodyParams, PathParams, CookiesParams, QueryParams} from '../../src/decorators/params';
import {Required} from '../../src/decorators/required';
import {Get} from '../../src/decorators/route';

export class TestInstance {
    middlewares: any;
    called: boolean = false;

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    myMethod(request, response, next): void {
        this.called = true;
    }

    myMethodAnnotated(
        @Request() request,
        @Response() response,
        @Next() next
    ){

    }

    /**
     *
     * @param test
     * @param test1
     * @param test2
     * @param test3
     * @returns {{test: string, test1: string, test2: string, test3: string}}
     */
    myMethodAnnotated2(
        @Required() @BodyParams('test') test: string,
        @Required() @PathParams('test') test1: string,
        @Required() @CookiesParams('test') test2: string,
        @Required() @QueryParams('test') test3: string,
    ) {
        return {test, test1, test2, test3}
    }

    /**
     *
     * @param test
     * @param test1
     * @param test2
     * @param test3
     * @returns {{test: string, test1: string, test2: string, test3: string}}
     */
    myMethodAnnotated3(
        @Required() @BodyParams('testUnknow') test: string
    ){

    }

    /**
     *
     * @param request
     * @param response
     * @param next
     * @returns {{data: string, _id: number}}
     */
    expliciteNext(request, response, next): any {
        this.called = true;

        response.send({data: "yes", _id: 1});

        next();
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     * @returns {Promise<T>|Promise<R>|Promise}
     */
    myMethodPromised(request, response): Promise<any> {
        this.called = true;

        return new Promise(function(resolve, reject){

            resolve({data: "yes", _id: 1});

        });
    }

    /**
     * 
     */
    myMethodThrowException(): void {
        this.called = true;

        throw new BadRequest("test");
    }
}

