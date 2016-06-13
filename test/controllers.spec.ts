
import * as Chai from "chai";
import * as Controllers from "../lib/controllers";
import {IController} from "../lib/controllers";
import {CalendarCtrl} from "../examples/controllers/calendars/CalendarCtrl";

let expect: Chai.ExpectStatic = Chai.expect;

describe("Controllers", () => {

    describe("Controllers.getCtrls()", function () {

        it("should return a metadata controllers list", function () {
            let ctrls: IController[] = Controllers.getCtrls();

            expect(ctrls).to.be.an("array");
            expect(ctrls.length > 0).to.be.true;

            expect(ctrls[0]).to.be.an('object');
            expect(ctrls[0].targetClass !== undefined).to.be.true;

        });

    });

    describe("Controllers.get()", function () {

        it("should return the metadata controller by his name", function () {

            let ctrl: IController = Controllers.get('CalendarCtrl');

            expect(ctrl != undefined).to.be.true;
            expect(ctrl).to.be.an('object');
            expect(ctrl.targetClass !== undefined).to.be.true;

        });

        it("should return the metadata controller by his class", function () {

            let ctrl: IController = Controllers.get(CalendarCtrl);

            expect(ctrl != undefined).to.be.true;
            expect(ctrl).to.be.an('object');
            expect(ctrl.targetClass !== undefined).to.be.true;

        });

        it("should return the metadata controller by his instance", function () {

            let ctrl: IController = Controllers.get(<any> new CalendarCtrl());

            expect(ctrl != undefined).to.be.true;
            expect(ctrl).to.be.an('object');
            expect(ctrl.targetClass !== undefined).to.be.true;

        });

        it("should not return the controller", function () {

            let ctrl: IController = Controllers.get('CalendarCtrl2');

            expect(ctrl).to.be.undefined;

        });

    });

    describe("Controllers.has()", function () {

        it("should return true, when it's called with controller name", function () {

            let has: boolean = Controllers.has('CalendarCtrl');

            expect(has).to.be.true;

        });

        it("should return true, when it's called with class", function () {

            let has: boolean = Controllers.has(CalendarCtrl);

            expect(has).to.be.true;

        });

        it("should return true, when it's called with instance", function () {

            let has: boolean = Controllers.has(<any> new CalendarCtrl());

            expect(has).to.be.true;

        });

        it("should return false when wrong name is given", function () {

            let has: boolean = Controllers.has('CalendarCtrl2');

            expect(has).to.be.false;

        });

    });

    describe("Controllers.instanciate()", function () {

        it("should instanciate new controller", function () {

            let myClass = function myClassTest(){};

            Controllers.setUrl(myClass, '/test/myclass');
            Controllers.setDepedencies(myClass, []);

            let ctrl: IController = Controllers.instanciate(myClass);

            expect(ctrl).to.be.an('object');
            expect(ctrl.targetClass !== undefined).to.be.true;
            expect(ctrl.instance instanceof myClass).to.be.true;

        });

        it("should throw error when controller is unknow", function () {

            let myClass = function myClassTest2(){};

            try {
                
                Controllers.instanciate(myClass);

            }catch(er){
                expect(er.toString()).to.equal('Error: Unable to instanciate controller myClassTest2.');
            }


        });
    });


});