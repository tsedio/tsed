import {assert, expect} from "../../../tools";
import {inject} from "../../../../src/testing/inject";
import {GlobalAcceptMimesMiddleware} from "../../../../src/mvc/components/GlobalAcceptMimesMiddleware";
import {FakeRequest} from "../../../helper/FakeRequest";
import {ServerSettingsService} from "../../../../src";

describe("GlobalAcceptMimesMiddleware", () => {

    before(inject([], () => {

        const map = new Map<string, any>();
        map.set("acceptMimes", ["application/json"]);

        this.middleware = new GlobalAcceptMimesMiddleware(new ServerSettingsService(map));
        this.request = new FakeRequest();
    }));

    describe("accept", () => {
        before(() => {
            this.request.mime = "application/json";
        });
        it("should return nothing", () => {
            expect(this.middleware.use(this.request)).to.eq(undefined);
        });
    });

    describe("not accept", () => {
        before(() => {
            this.request.mime = "text/html";
        });

        it("should throws NotAcceptable", () => {
            assert.throws(() => {
                this.middleware.use(this.request);
            }, "You must accept content-type application/json");
        });
    });

});
