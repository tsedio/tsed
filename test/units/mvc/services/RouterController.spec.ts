import {assert, expect} from "chai";
import {RouterController} from "../../../../src/common/mvc/services/RouterController";

describe("RouterController", () => {
    before(() => {
        this.router = {};
        this.routerController = new RouterController(this.router);
    });

    it("should return router", () => {
        expect(this.routerController.getRouter()).to.eq(this.router);
    });
});