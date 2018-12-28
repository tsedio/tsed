import {Allow, ConverterService, Property, PropertyType, Required} from "@tsed/common";
import {Model, MongooseModel} from "@tsed/mongoose";
import {inject} from "@tsed/testing";
import {expect} from "chai";

@Model()
export class TestModel {
  @Required()
  @Allow("", null)
  email: string;

  @Property() number: number;
}

export class AdminModel {
  @Property({name: "id"}) // this one looks like _id in response, but it should be just id
  _id: string;

  @Property() role: string;
}

@Model({
  name: "Service"
})
export class ServiceModel {
  @Property({name: "id"}) // this one works as expected and turns into id
  _id: string;

  @PropertyType(AdminModel) admins: AdminModel[];
}

describe("Mongoose", () => {
  describe("TestModel", () => {
    describe("when null is given", () => {
      before(
        inject([TestModel], (testModel: MongooseModel<TestModel>) => {
          this.result = new testModel({email: null, number: 2});
          this.error = this.result.validateSync();
        })
      );

      it("should validate the model", () => {
        expect({email: this.result.email, number: this.result.number}).to.deep.eq({email: null, number: 2});
      });
      it("shouldn't throw an error", () => {
        expect(!!this.error).to.eq(false, this.error);
      });
    });

    describe("when empty is given", () => {
      before(
        inject([TestModel], (testModel: MongooseModel<TestModel>) => {
          this.result = new testModel({email: "", number: 2});
          this.error = this.result.validateSync();
        })
      );

      it("should validate the model", () => {
        expect({email: this.result.email, number: this.result.number}).to.deep.eq({email: "", number: 2});
      });
      it("shouldn't throw an error", () => {
        expect(!!this.error).to.eq(false, this.error);
      });
    });

    describe("when undefined is given", () => {
      before(
        inject([TestModel], async (testModel: MongooseModel<TestModel>) => {
          this.result = new testModel({email: undefined, number: 2});
          this.error = this.result.validateSync();
        })
      );

      it("should validate the model", () => {
        expect({email: this.result.email, number: this.result.number}).to.deep.eq({email: undefined, number: 2});
      });
      it("should throw an error", () => {
        expect(!!this.error).to.eq(true, this.error);
      });
    });
  });

  xdescribe("ServiceModel", () => {
    before(
      inject([ServiceModel, ConverterService], (serviceModel: MongooseModel<ServiceModel>, converterService: ConverterService) => {
        this.result = new serviceModel({
          admins: [{role: "role"}]
        });

        this.converted = converterService.serialize(this.result);
      })
    );

    it("should return a serialized object", () => {
      expect(this.converted)
        .to.have.property("id")
        .that.is.a("string");
      expect(this.converted.admins[0])
        .to.have.property("id")
        .that.is.a("string");
      expect(this.converted.admins[0])
        .to.have.property("role")
        .that.is.a("string");
    });
  });
});
