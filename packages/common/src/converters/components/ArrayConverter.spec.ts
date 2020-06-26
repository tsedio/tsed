import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {ArrayConverter, ConverterService} from "../../../src/converters";

describe("ArrayConverter", () => {
  let arrayConverter: ArrayConverter;
  before(
    PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
      arrayConverter = converterService.getConverter<ArrayConverter>(Array)!;
    })
  );
  after(PlatformTest.reset);

  it("should do something", () => {
    expect(!!arrayConverter).to.be.true;
  });

  describe("deserialize()", () => {
    const deserializer = Sinon.stub();

    it("should deserialize data as array when a number is given", () => {
      expect(arrayConverter.deserialize(1, Array, Number, deserializer)).to.be.an("array");
    });

    it("should deserialize data as array when an array is given", () => {
      expect(arrayConverter.deserialize([1], Array, Number, deserializer)).to.be.an("array");
    });

    it("should call the deserializer callback", () => {
      expect(deserializer).to.have.been.calledWithExactly(1, Number);
    });
  });
});
