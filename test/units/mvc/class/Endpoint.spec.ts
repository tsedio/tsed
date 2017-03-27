import {assert, expect} from "chai";
import {Endpoint} from "../../../../src/mvc/class/Endpoint";
import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
class Test {

}
describe("Endpoint", () => {

    before(() => {
        Endpoint.setMetadata("test", "value", Test, "method");
        Endpoint.useBefore(Test, "method", [() => {
        }]);
        Endpoint.useAfter(Test, "method", [() => {
        }]);
        Endpoint.use(Test, "method", [() => {
        }]);
    });

    it("should get endpoint metadata", () => {
        expect(Endpoint.getMetadata("test", Test, "method")).to.eq("value");
    });

    it("should get an EndpointMetadata", () => {
        expect(Endpoint.get(Test, "method")).to.be.an.instanceof(EndpointMetadata);
    });

    it("should get endpoint metadata", () => {
        expect(Endpoint.has(Test, "method")).to.eq(true);
    });
});