import {expect} from "chai";
import RequestService from '../src/services/request';
import {FakeRequest} from './helper';
import {inject} from '../testing';

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
});