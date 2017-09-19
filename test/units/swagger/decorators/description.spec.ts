import {Store} from "../../../../src/core/class/Store";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect} from "../../../tools";
import { descriptorOf, decoratorArgs } from '../../../../src/core/utils';
import { EndpointRegistry } from '../../../../src/mvc/registries/EndpointRegistry';
import { ControllerRegistry } from '../../../../src/mvc/registries/ControllerRegistry';


class Test {
    test(a:any) {

    }
}


describe("Description() on method", () => {
    before(() => {
        let args = decoratorArgs(Test, "test");
        Description("description")(...args);
        this.store = Store.from(...args);
    });
    it("should set the operation", () => {
        expect(this.store.get("operation")).to.deep.eq({description: "description"});
    });
});

describe("Description() on param", () => {
    before(() => {
        let args = [Test, "test", 0];
        Description("description")(...args);
        this.store = Store.from(...args);
    });
    it("should set the baseparameter", () => {
        expect(this.store.get("baseparameter")).to.deep.eq({description: "description"});
    });
});

describe("Description() on class", () => {
    before(() => {   
        let args = [Test];
        Description("description")(...args);
        this.store = Store.from(...args);
    });
    it("should set the schema", () => {
        expect(this.store.get("schema")).to.deep.eq({description: "description"});
    });
});

describe("Description() on ctrl", () => {
    before(() => {
        ControllerRegistry.createIfNotExists(Test);
        let args = [Test];
        Description("description")(...args);
        this.store = Store.from(...args);
    });
    it("should set the tag", () => {
        expect(this.store.get("tag")).to.deep.eq({description: "description"});
    });
});