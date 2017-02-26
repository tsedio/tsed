import {expect} from "chai";
import RequestService from '../src/services/request';
import {FakeRequest} from './helper';
import {inject} from '../src/testing';

describe('RequestService :', function() {

    it('should return header info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.getHeader(new FakeRequest, 'x-token')).to.equal('headerValue');

    }));

    it('should return body info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.parseBody(new FakeRequest, 'test')).to.equal('testValue');

    }));

    it('should return cookies info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.parseCookies(new FakeRequest, 'test')).to.equal('testValue');

    }));

    it('should return params info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.parseParams(new FakeRequest, 'test')).to.equal('testValue');

    }));

    it('should return query info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.parseParams(new FakeRequest, 'test')).to.equal('testValue');

    }));

    it('should return session info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.parseSession(new FakeRequest, 'test')).to.equal('testValue');

    }));

    it('should return responseData info', inject([RequestService], (requestService: RequestService) => {

        const request = new FakeRequest();
        request.storeData('test');

        expect(requestService.responseData(request)).to.equal('test');

    }));

    it('should return endpoint info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.endpointInfo({getEndpoint: () => 'test'})).to.equal('test');

    }));

    it('should return multipart info', inject([RequestService], (requestService: RequestService) => {

        expect(requestService.multipartFile({"files": ['test']})).to.equal('test');
        expect(requestService.multipartFiles({"files": ['test']})).to.be.an('array');

    }));
});