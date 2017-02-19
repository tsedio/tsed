import * as Chai from "chai";
import assert = require('assert');
import {FakeClass, FakeClassChildren} from './helper';
import Metadata from '../src/services/metadata';
import {
    CONTROLLER_URL, ENDPOINT_USE, CONTROLLER_DEPEDENCIES,
    CONTROLLER_MOUNT_ENDPOINTS
} from '../src/constants/metadata-keys';

import {Endpoint} from '../src/controllers/endpoint';
import ControllerService from '../src/services/controller';
import {inject} from '../src/testing/inject';

let expect: Chai.ExpectStatic = Chai.expect;

describe("Controller & ControllerService :", () => {

    describe("new Controller()", () => {

        it('should build controller', inject([ControllerService], (controllerService: ControllerService) => {

            Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClass, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClass, "testMethod2");

            controllerService.load();

            const ctrl = controllerService.get(FakeClass);

            expect(ctrl.getName()).to.equal('FakeClass');
            expect(ctrl.hasEndpointUrl()).to.equal(true);
            expect(ctrl.getEndpointUrl()).to.equal('/fake-class');

            const instance = controllerService.invoke(ctrl);

            expect(instance).to.not.equal(FakeClass);
            expect(instance).to.be.instanceof(FakeClass);

        }));

        it('should build controller with dependencies', inject([ControllerService], (controllerService: ControllerService) => {

            Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
            Metadata.set(CONTROLLER_DEPEDENCIES, [FakeClassChildren], FakeClass);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClass, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClass, "testMethod2");

            Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
            Metadata.set(CONTROLLER_DEPEDENCIES, [], FakeClassChildren);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClassChildren, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClassChildren, "testMethod2");

            ControllerService.controllers = new Map<any,any>();
            controllerService.load();

            const ctrl = controllerService.get(FakeClass);
            const children = controllerService.get(FakeClassChildren);

            expect(ctrl.getName()).to.equal('FakeClass');
            expect(ctrl.hasEndpointUrl()).to.equal(true);
            expect(ctrl.getEndpointUrl()).to.equal('/fake-class');

            const instance = controllerService.invoke(ctrl);

            expect(instance).to.not.equal(FakeClass);
            expect(instance).to.be.instanceof(FakeClass);

            //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');

            // (<any>ctrl).resolveDependencies();

            expect((<any>children).parent).to.equal(ctrl);
            expect((<any>ctrl).parent).to.equal(undefined);

        }));

        it('should build controller with string dependencies', inject([ControllerService], (controllerService: ControllerService) => {

            ControllerService.controllers = new Map<any,any>();

            Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
            Metadata.set(CONTROLLER_DEPEDENCIES, [FakeClassChildren], FakeClass);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClass, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClass, "testMethod2");

            Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
            Metadata.set(CONTROLLER_DEPEDENCIES, [], FakeClassChildren);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClassChildren, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClassChildren, "testMethod2");


            controllerService.load();

            const ctrl = controllerService.get(FakeClass);
            const children = controllerService.get(FakeClassChildren);


            expect(ctrl.getName()).to.equal('FakeClass');
            expect(ctrl.hasEndpointUrl()).to.equal(true);
            expect(ctrl.getEndpointUrl()).to.equal('/fake-class');

            const instance = controllerService.invoke(ctrl);

            expect(instance).to.not.equal(FakeClass);
            expect(instance).to.be.instanceof(FakeClass);

            //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');

            // (<any>ctrl).resolveDependencies();

            expect((<any>children).parent).to.equal(ctrl);
            expect((<any>ctrl).parent).to.equal(undefined);

        }));

        it('should throw error when dependencies is unknow', inject([ControllerService], (controllerService: ControllerService) => {

            ControllerService.controllers = new Map<any,any>();

            Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
            Metadata.set(CONTROLLER_DEPEDENCIES, ["FakeClassChildrenError"], FakeClass);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClass, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClass, "testMethod2");

            Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClassChildren, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClassChildren, "testMethod2");


            //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');

            try{
                controllerService.load();
                assert.ok(false);
            }catch(er){
                expect(er.message).to.equal('Controller FakeClassChildrenError not found.');
            }

            Metadata.set(CONTROLLER_DEPEDENCIES, [], FakeClass);

        }));

        it('should load controllers from metadata', inject([ControllerService], (controllerService: ControllerService) => {

            ControllerService.controllers = new Map<any,any>();

            Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
            Metadata.set(CONTROLLER_DEPEDENCIES, [FakeClassChildren], FakeClass);
            Metadata.set(CONTROLLER_MOUNT_ENDPOINTS, ["/rest"], FakeClass);

            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClass, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClass, "testMethod2");

            Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
            Metadata.set(CONTROLLER_DEPEDENCIES, [], FakeClassChildren);
            Metadata.set(ENDPOINT_USE, ['get', '/'], FakeClassChildren, "testMethod1");
            Metadata.set(ENDPOINT_USE, ['post', '/'], FakeClassChildren, "testMethod2");

            controllerService.load();

            expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');
            expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass).length).to.equal(1);

            expect(ControllerService.controllers).to.be.instanceof(Map);

            // Test
            const fakeClass = controllerService.get(FakeClass);
            const fakeClassEndpoints: Endpoint[]= (fakeClass as any).endpoints;
            const fakeChildrenClass = controllerService.get(FakeClassChildren);
            const routes = controllerService.getRoutes();


            expect(fakeClass.getEndpointUrl()).to.equal('/fake-class');
            expect(fakeChildrenClass.getEndpointUrl()).to.equal('/children');

            expect(fakeClassEndpoints[0].getMethod()).to.equal('get');
            expect(fakeClassEndpoints[0].getRoute()).to.equal('/');
            expect(fakeClassEndpoints[1].getMethod()).to.equal('post');
            expect(fakeClassEndpoints[1].getRoute()).to.equal('/');

            expect(routes).to.be.an('array');
            expect(routes.length).to.equal(4);
            expect(routes[0].method).to.equal('get');
            expect(routes[0].url).to.equal('/rest/fake-class/');
            expect(routes[1].method).to.equal('post');

            let str = '';
            controllerService.printRoutes({info: (p) => (str += p)});
        }));

        it('should load middlewares', inject([ControllerService], (controllerService: ControllerService) => {

            ControllerService.controllers = new Map<any,any>();

            Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
            Metadata.set(CONTROLLER_DEPEDENCIES, [], FakeClass);
            Metadata.set(CONTROLLER_MOUNT_ENDPOINTS, ["/rest"], FakeClass);

            Metadata.set(ENDPOINT_USE, ['head'], FakeClass, "testMethod1");
            Metadata.set(ENDPOINT_USE, [new Function], FakeClass, "testMethod2");

            controllerService.load();

            const routes = controllerService.getRoutes();

            expect(routes).to.be.an('array');

        }));
    });

});