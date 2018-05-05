import {Allow, Property, Required} from "@tsed/common";
import {Model, MongooseModel} from "@tsed/mongoose";
import {inject} from "@tsed/testing";
import {expect} from "../../tools";

@Model()
export class TestModel {
    @Required()
    @Allow("", null)
    email: string;

    @Property()
    number: number;
}

describe("Mongoose", () => {
    describe("when null is given", () => {
        before(inject([TestModel], (testModel: MongooseModel<TestModel>) => {

            this.result = new testModel({email: null, number: 2});
            this.error = this.result.validateSync();
        }));

        it("should validate the model", () => {
            expect({email: this.result.email, number: this.result.number}).to.deep.eq({email: null, number: 2});
        });
        it("shouldn't throw an error", () => {
            expect(!!this.error).to.eq(false, this.error);
        });
    });

    describe("when empty is given", () => {
        before(inject([TestModel], (testModel: MongooseModel<TestModel>) => {

            this.result = new testModel({email: "", number: 2});
            this.error = this.result.validateSync();
        }));

        it("should validate the model", () => {
            expect({email: this.result.email, number: this.result.number}).to.deep.eq({email: "", number: 2});
        });
        it("shouldn't throw an error", () => {
            expect(!!this.error).to.eq(false, this.error);
        });
    });

    describe("when undefined is given", () => {
        before(inject([TestModel], async (testModel: MongooseModel<TestModel>) => {
            this.result = new testModel({email: undefined, number: 2});
            this.error = this.result.validateSync();
        }));

        it("should validate the model", () => {
            expect({email: this.result.email, number: this.result.number}).to.deep.eq({email: undefined, number: 2});
        });
        it("should throw an error", () => {
            expect(!!this.error).to.eq(true, this.error);
        });
    });
});