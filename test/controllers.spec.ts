
import * as Chai from "chai";
import Controller from "../src/controllers/controller";
import {CalendarCtrl} from "../examples/controllers/calendars/CalendarCtrl";

let expect: Chai.ExpectStatic = Chai.expect;

describe("Controllers", () => {

    describe("Controller.getCtrls()", function () {

        it("should return a metadata controllers list", function () {
            let ctrls: Controller[] = Controller.controllers;

            expect(ctrls).to.be.an("array");
            expect(ctrls.length > 0).to.be.true;

            expect(ctrls[0]).to.be.an('object');
            expect((<any>ctrls[0]).targetClass !== undefined).to.be.true;

        });

    });

    describe("Controller.get()", function () {

        it("should return the metadata controller by his name", function () {

            let ctrl: Controller = Controller.getController('CalendarCtrl');

            expect(ctrl != undefined).to.be.true;
            expect(ctrl).to.be.an('object');
            expect((<any>ctrl).targetClass !== undefined).to.be.true;

        });

        it("should return the metadata controller by his class", function () {

            let ctrl: Controller = Controller.getController(CalendarCtrl);

            expect(ctrl != undefined).to.be.true;
            expect(ctrl).to.be.an('object');
            expect((<any>ctrl).targetClass !== undefined).to.be.true;

        });

        it("should return the metadata controller by his instance", function () {

            let ctrl: Controller = Controller.getController(<any> new CalendarCtrl());

            expect(ctrl != undefined).to.be.true;
            expect(ctrl).to.be.an('object');
            expect((<any>ctrl).targetClass !== undefined).to.be.true;

        });

        it("should not return the controller", function () {

            try{
                Controller.getController('CalendarCtrl2');
            }catch(er){
                expect(er.message).to.contains("Controller CalendarCtrl2 not found.");
            }

        });

    });

    describe("Controller.has()", function () {

        xit("should return true, when it's called with controller name", function () {

            let has: boolean = Controller.hasController('CalendarCtrl');

            expect(has).to.be.true;

        });

        it("should return true, when it's called with class", function () {

            let has: boolean = Controller.hasController(CalendarCtrl);

            expect(has).to.be.true;

        });

        it("should return true, when it's called with instance", function () {

            let has: boolean = Controller.hasController(<any> new CalendarCtrl());

            expect(has).to.be.true;

        });

        it("should return false when wrong class is given", function () {
            let CalendarCtrl2 = function myClassTest(){};

            let has: boolean = Controller.hasController(CalendarCtrl2);

            expect(has).to.be.false;

        });

    });

    describe("Controller.instanciate()", function () {

        it("should instanciate new controller", function () {

            let myClass = function myClassTest(){};

            Controller.setUrl(myClass, '/test/myclass');
            Controller.setDepedencies(myClass, []);

            let ctrl: Controller = Controller.getController(new myClass).instanciate();

            expect(ctrl).to.be.an('object');
            expect((<any>ctrl).targetClass !== undefined).to.be.true;
            expect((<any>ctrl).instance instanceof myClass).to.be.true;

        });

        it("should throw error when controller is unknow", function () {

            let myClass = function myClassTest2(){};

            try {
                
                Controller.getController(myClass).instanciate();

            }catch(er){
                expect(er.toString()).to.equal('Error: Controller myClassTest2 not found.');
            }


        });
    });


});