import Chai = require("chai");
import MiddlewareService from "../src/services/middleware";
import {inject} from '../src/testing/inject';
import GlobalErrorHandlerMiddleware from "../src/middlewares/global-error-handler";
import {FakeResponse} from "./helper/FakeResponse";
import {$log} from "ts-log-debug";
import {FakeRequest} from "./helper/FakeRequest";
import AcceptMimeMiddleware from "../src/middlewares/accept-mimes";
import GlobalAcceptMimesMiddleware from "../src/middlewares/global-accept-mimes";
import {ServerSettingsService} from "../src/services/server-settings";
// import MultipartFileMiddleware from "../src/middlewares/multipart-file";

let expect: Chai.ExpectStatic = Chai.expect;

describe('GlobalErrorHandlerMiddleware :', () => {

    it('should do nothing if response is sent', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<GlobalErrorHandlerMiddleware>(GlobalErrorHandlerMiddleware);

        const response = new FakeResponse();
        response['headersSent'] = true;

        middleware.use(
            new Error('test'),
            new FakeRequest() as any,
            response as any,
            () => ({})
        );

        expect(response._body).is.equal('');

    }));

    it('should respond error 404 with his message', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<GlobalErrorHandlerMiddleware>(GlobalErrorHandlerMiddleware);
        const response = new FakeResponse();
        response['headersSent'] = false;

        middleware.use(
            "Message not found",
            new FakeRequest() as any,
            response as any,
            () => ({})
        );

        expect(response._body).is.equal('Message not found');
        expect(response._status).is.equal(404);

    }));

    it('should respond error 500 and Internal Error', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        $log.setRepporting({
            error: false
        });

        const middleware = middlewareService.invoke<GlobalErrorHandlerMiddleware>(GlobalErrorHandlerMiddleware);

        const response = new FakeResponse();
        response['headersSent'] = false;

        middleware.use(
            new Error(),
            new FakeRequest() as any,
            response as any,
            () => ({})
        );

        expect(response._body).is.equal('Internal Error');
        expect(response._status).is.equal(500);

        $log.setRepporting({
            error: true
        });

    }));
});

describe('GlobalAcceptMimesMiddleware :', () => {

    it('should accept mime', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const map = new Map<string, any>();
        map.set('acceptMimes', ['application/json']);

        const middleware = new GlobalAcceptMimesMiddleware(new ServerSettingsService(map));
        const request = new FakeRequest();

        request.mime = "application/json";

        middleware.use(request);

    }));

    /*it('should accept mime', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<AcceptMimeMiddleware>(AcceptMimeMiddleware);
        const request = new FakeRequest();

        request.mime = "application/json";

        middleware.use({
            getMetadata: () => {
                return undefined
            }
        } as any, request as any);

    }));*/

    it('should not accept mime', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        try {

            const map = new Map<string, any>();
            map.set('acceptMimes', ['application/xml']);

            const middleware = new GlobalAcceptMimesMiddleware(new ServerSettingsService(map));
            const request = new FakeRequest();

            request.mime = "text/html";

            middleware.use(request);

        } catch (er) {
            expect(er.message).contains("You must accept content-type application/xml");
        }


    }));

});


describe('AcceptMimesMiddleware :', () => {

    it('should accept mime', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<AcceptMimeMiddleware>(AcceptMimeMiddleware);
        const request = new FakeRequest();

        request.mime = "application/json";

        middleware.use({
            getMetadata: () => {
                return ['application/json']
            }
        } as any, request as any);

    }));

    it('should accept mime', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<AcceptMimeMiddleware>(AcceptMimeMiddleware);
        const request = new FakeRequest();

        request.mime = "application/json";

        middleware.use({
            getMetadata: () => {
                return undefined
            }
        } as any, request as any);

    }));

    it('should not accept mime', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        try {
            const middleware = middlewareService.invoke<AcceptMimeMiddleware>(AcceptMimeMiddleware);
            const request = new FakeRequest();

            request.mime = "application/json";

            middleware.use({
                getMetadata: () => {
                    return ['application/xml']
                }
            } as any, request as any);
        } catch (er) {
            expect(er.message).contains("You must accept content-type application/xml");
        }


    }));

});
