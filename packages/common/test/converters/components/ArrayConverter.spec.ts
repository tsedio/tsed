import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {ConverterService} from "../../../src/converters";

describe("ArrayConverter", () => {
  before(
    inject([ConverterService], (converterService: ConverterService) => {
      this.arrayConverter = converterService.getConverter(Array);
    })
  );
  after(TestContext.reset);

  it("should do something", () => {
    expect(!!this.arrayConverter).to.be.true;
  });

  describe("deserialize()", () => {
    before(() => {
      this.deserializer = Sinon.stub();
    });
    it("should deserialize data as array when a number is given", () => {
      expect(this.arrayConverter.deserialize(1, Array, Number, this.deserializer)).to.be.an("array");
    });

    it("should deserialize data as array when an array is given", () => {
      expect(this.arrayConverter.deserialize([1], Array, Number, this.deserializer)).to.be.an("array");
    });

    it("should call the deserializer callback", () => {
      this.deserializer.should.have.been.calledWithExactly(1, Number);
    });
  });
});
