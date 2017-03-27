import {assert, expect} from "chai";
import {Provider} from "../../../../src/di/class/Provider";

class T1 {
}
class T2 {
}

describe("Provider", () => {
    before(() => {
        this.provider = new Provider(T1);
    });

    describe("className", () => {
        it("should return the class name", () => {
            expect(this.provider.className).to.eq("T1");
        });
    });

    describe("provide", () => {
        it("should equal to the class provided", () => {
            this.provider.provide = T2;
            expect(this.provider.provide).to.equal(T2);
        });
    });

    describe("useClass", () => {
        it("should not equal to the class provided", () => {
            this.provider.provide = class {
            };
            expect(this.provider.provide).not.to.equal(T2);
        });
    });

    describe("instance", () => {
        it("should have an instance", () => {
            this.provider.provide = T1;
            this.provider.useClass = T2;
            this.provider.instance = new this.provider.useClass;
            expect(this.provider.instance).instanceOf(T2);
        });
    });

    describe("type", () => {
        it("should set a type of provider", () => {
            this.provider.type = "typeTest";
            expect(this.provider.type).to.equal("typeTest");
        });
    });


});