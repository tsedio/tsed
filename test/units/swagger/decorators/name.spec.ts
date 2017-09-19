import { Name } from '../../../../src/swagger/decorators/name';
import { Store } from '../../../../src/core/class/Store';
import {expect} from "../../../tools";
import { ControllerRegistry } from '../../../../src/mvc/registries/ControllerRegistry';
import { decoratorArgs } from '../../../../src/core/utils';
class Test {
    test(a:any) {

    }
}


describe("Name() on param", () => {
    before(() => {
        let args = [Test, "test", 0];
        Name("name")(...args);
        this.store = Store.from(...args);
    });
    it("should set the baseparameter", () => {
        expect(this.store.get("baseparameter")).to.deep.eq({name: "name"});
    });
});

describe("Name() on class", () => {
    it("should throw an error", () => {
        let args = [Test];
        let fn = Name("name");
        expect(()=>fn(...args)).to.throw();
    });
});

describe("Name() on method", () => {
    it("should throw an error", () => {
        let args = decoratorArgs(Test, "test");
        let fn = Name("name");
        expect(()=>fn(...args)).to.throw();
       
    });
});



describe("Name() on ctrl", () => {
    before(() => {
        ControllerRegistry.createIfNotExists(Test);
        let args = [Test];
        Name("name")(...args);
        this.store = Store.from(...args);
    });
    it("should set the baseparameter", () => {
        expect(this.store.get("tag")).to.deep.eq({name: "name"});
    });
});