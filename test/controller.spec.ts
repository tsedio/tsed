// import * as Chai from "chai";
// import Controller from "../src/controllers/controller";
// import {FakeClass, FakeClassChildren} from './helper/FakeClass';
// import Metadata from '../src/metadata/metadata';
// import {CONTROLLER_URL, ENDPOINT_ARGS, CONTROLLER_DEPEDENCIES} from '../src/constants/metadata-keys';
// import assert = require('assert');
// import {Endpoint} from '../src/controllers/endpoint';
//
// let expect: Chai.ExpectStatic = Chai.expect;
//
// xdescribe("Controller :", () => {
//
//     describe("new Controller()", () => {
//
//         it('should build controller', () => {
//             //Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");
//
//             const ctrl: Controller = new (<any>Controller)(
//                 FakeClass,
//                 '/fake-class'
//             );
//
//             expect(ctrl.getName()).to.equal('FakeClass');
//             expect(ctrl.hasEndpointUrl()).to.equal(true);
//             expect(ctrl.getEndpointUrl()).to.equal('/fake-class');
//
//             expect(ctrl.getInstance()).to.not.equal(FakeClass);
//             expect(ctrl.getInstance()).to.be.instanceof(FakeClass);
//         });
//
//         it('should build controller with depedencies', () => {
//             Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");
//
//             Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClassChildren, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClassChildren, "testMethod2");
//
//             const ctrl: Controller = new (<any>Controller)(
//                 FakeClass,
//                 '/fake-class',
//                 [FakeClassChildren]
//             );
//
//             const children: Controller =  new (<any>Controller)(
//                 FakeClassChildren,
//                 '/children',
//                 []
//             );
//
//             Controller.controllers = [ctrl, children];
//
//             expect(ctrl.getName()).to.equal('FakeClass');
//             expect(ctrl.hasEndpointUrl()).to.equal(true);
//             expect(ctrl.getEndpointUrl()).to.equal('/fake-class');
//
//             expect(ctrl.getInstance()).to.not.equal(FakeClass);
//             expect(ctrl.getInstance()).to.be.instanceof(FakeClass);
//
//             //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');
//
//             (<any>ctrl).resolveDepedencies();
//
//             expect((<any>children).parent).to.equal(ctrl);
//             expect((<any>ctrl).parent).to.equal(undefined);
//
//         });
//
//         it('should build controller with string depedencies', () => {
//             Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");
//
//             Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClassChildren, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClassChildren, "testMethod2");
//
//             const ctrl: Controller = new (<any>Controller)(
//                 FakeClass,
//                 '/fake-class',
//                 ["FakeClassChildren"]
//             );
//
//             const children: Controller =  new (<any>Controller)(
//                 FakeClassChildren,
//                 '/children',
//                 []
//             );
//
//             Controller.controllers = [ctrl, children];
//
//             expect(ctrl.getName()).to.equal('FakeClass');
//             expect(ctrl.hasEndpointUrl()).to.equal(true);
//             expect(ctrl.getEndpointUrl()).to.equal('/fake-class');
//
//             expect(ctrl.getInstance()).to.not.equal(FakeClass);
//             expect(ctrl.getInstance()).to.be.instanceof(FakeClass);
//
//             //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');
//
//             (<any>ctrl).resolveDepedencies();
//
//             expect((<any>children).parent).to.equal(ctrl);
//             expect((<any>ctrl).parent).to.equal(undefined);
//
//         });
//
//         it('should throw error when depedencies is unknow', () =>{
//             Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");
//
//             Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClassChildren, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClassChildren, "testMethod2");
//
//             const ctrl: Controller = new (<any>Controller)(
//                 FakeClass,
//                 '/fake-class',
//                 ["FakeClassChildrenError"]
//             );
//
//             const children: Controller =  new (<any>Controller)(
//                 FakeClassChildren,
//                 '/children',
//                 []
//             );
//
//             Controller.controllers = [ctrl, children];
//
//             expect(ctrl.getName()).to.equal('FakeClass');
//             expect(ctrl.hasEndpointUrl()).to.equal(true);
//             expect(ctrl.getEndpointUrl()).to.equal('/fake-class');
//
//             expect(ctrl.getInstance()).to.not.equal(FakeClass);
//             expect(ctrl.getInstance()).to.be.instanceof(FakeClass);
//
//             //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');
//
//             try{
//                 (<any>ctrl).resolveDepedencies();
//                 assert.ok(false);
//             }catch(er){
//                 expect(er.message).to.equal('Controller FakeClassChildrenError not found.');
//             }
//
//         });
//
//         it('should load controllers from metadata', () => {
//             Controller.controllers =[];
//
//             Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
//             Metadata.set(CONTROLLER_DEPEDENCIES, [FakeClassChildren], FakeClass);
//
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");
//
//             Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
//             Metadata.set(CONTROLLER_DEPEDENCIES, [], FakeClassChildren);
//             Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClassChildren, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClassChildren, "testMethod2");
//
//             Controller.load({use:() => (undefined)}, '/rest');
//
//             expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');
//             expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass).length).to.equal(1);
//
//             expect(Controller.controllers).to.be.an('array');
//             expect(Controller.controllers[0].getEndpointUrl()).to.equal('/fake-class');
//             expect(Controller.controllers[0].getAbsoluteUrl()).to.equal('/rest/fake-class');
//
//             expect(Controller.controllers[1].getEndpointUrl()).to.equal('/children');
//             expect(Controller.controllers[1].getAbsoluteUrl()).to.equal('/rest/fake-class/children');
//
//             const endpoints: Endpoint[]= (<any>Controller.controllers[0]).endpoints;
//
//             expect(endpoints[0].getMethod()).to.equal('get');
//             expect(endpoints[0].getRoute()).to.equal('/');
//             expect(endpoints[1].getMethod()).to.equal('post');
//             expect(endpoints[1].getRoute()).to.equal('/');
//
//             const routes = Controller.getRoutes();
//
//             expect(routes).to.be.an('array');
//             expect(routes.length).to.equal(4);
//             expect(routes[0].method).to.equal('get');
//             expect(routes[0].url).to.equal('/rest/fake-class/');
//             expect(routes[1].method).to.equal('post');
//
//             let str = '';
//             Controller.printRoutes({info: (p) => (str += p)});
//         });
//
//         it('should load middlewares', () => {
//
//             //Metadata.clear();
//
//             Controller.controllers = [];
//
//             Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
//             Metadata.set(CONTROLLER_DEPEDENCIES, [], FakeClass);
//
//             Metadata.set(ENDPOINT_ARGS, ['head'], FakeClass, "testMethod1");
//             Metadata.set(ENDPOINT_ARGS, [new Function], FakeClass, "testMethod2");
//
//             Controller.load({use:() => (undefined)}, '/rest');
//
//             const routes = Controller.getRoutes();
//
//             expect(routes).to.be.an('array');
//
//         });
//     });
//
//
//
//
// });