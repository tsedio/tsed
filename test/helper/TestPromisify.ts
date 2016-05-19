import {BadRequest} from "httpexceptions";

export class TestPromisify {
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

    /**
     *
     * @param request
     * @param response
     * @param next
     * @returns {{data: string, _id: number}}
     */
    myMethodReturnValue(request, response, next): any {
        this.called = true;

        return {data: "yes", _id: 1};
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     * @returns {Promise<T>|Promise<R>|Promise}
     */
    myMethodPromised(request, response, next): Promise<any> {
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

