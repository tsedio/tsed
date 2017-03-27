import {expect} from "chai";
import {FakeRequest} from './helper';
import {inject} from '../src/testing';
import {HeaderFilter} from "../src/filters/header";
import FilterService from "../src/services/filter";
import {FakeResponse} from "./helper/FakeResponse";
import {BodyParamsFilter} from "../src/filters/body-params";
import {CookiesParamsFilter} from "../src/filters/cookies-params";
import {PathParamsFilter} from "../src/filters/path-params";
import {SessionFilter} from "../src/filters/session";
import {MultipartFileFilter, MultipartFilesFilter} from "../src/filters/multipart-file";
import {QueryParamsFilter} from "../src/filters/query-params";

describe('RequestService :', function() {

    it('should return header info', inject([FilterService], (filterService: FilterService) => {

        const result = filterService.invokeMethod<HeaderFilter>(
            HeaderFilter,
            'x-token',
            new FakeRequest,
            new FakeResponse
        );

        expect(result).to.equal('headerValue');

    }));

    it('should return body info', inject([FilterService], (filterService: FilterService) => {

        const result = filterService.invokeMethod<BodyParamsFilter>(
            BodyParamsFilter,
            'test',
            new FakeRequest,
            new FakeResponse
        );

        expect(result).to.equal('testValue');

    }));

    it('should return cookies info',  inject([FilterService], (filterService: FilterService) => {

        const result = filterService.invokeMethod<CookiesParamsFilter>(
            CookiesParamsFilter,
            'test',
            new FakeRequest,
            new FakeResponse
        );

        expect(result).to.equal('testValue');

    }));

    it('should return params info',  inject([FilterService], (filterService: FilterService) => {
        const result = filterService.invokeMethod<PathParamsFilter>(
            PathParamsFilter,
            'test',
            new FakeRequest,
            new FakeResponse
        );
        expect(result).to.equal('testValue');

    }));

    it('should return query info',  inject([FilterService], (filterService: FilterService) => {

        const result = filterService.invokeMethod<QueryParamsFilter>(
            QueryParamsFilter,
            'test',
            new FakeRequest,
            new FakeResponse
        );

        expect(result).to.equal('testValue');

    }));

    it('should return session info',  inject([FilterService], (filterService: FilterService) => {

        const result = filterService.invokeMethod<SessionFilter>(
            SessionFilter,
            'test',
            new FakeRequest,
            new FakeResponse
        );

        expect(result).to.equal('testValue');

    }));

    it('should return multipart info',  inject([FilterService], (filterService: FilterService) => {


        let result = filterService.invokeMethod<MultipartFileFilter>(
            MultipartFileFilter,
            'test',
            {"files": ['test']},
            new FakeResponse
        );

        expect(result).to.equal('test');

        result = filterService.invokeMethod<MultipartFilesFilter>(
            MultipartFilesFilter,
            'test',
            {"files": ['test']},
            new FakeResponse
        );

        expect(result).to.be.an('array');

    }));

    /*it('should return responseData info',  inject([FilterService], (filterService: FilterService) => {

        const request = new FakeRequest();
        request.storeData('test');

        const result = filterService.invokeMethod<ResponseDataFilter>(
            CookiesParamsFilter,
            'test',
            new FakeRequest,
            new FakeResponse
        );



        expect(requestService.responseData(request)).to.equal('test');

    }));*/

    /*it('should return endpoint info',  inject([FilterService], (filterService: FilterService) => {

        expect(requestService.endpointInfo({getEndpoint: () => 'test'})).to.equal('test');

    }));*/

    /**/
});