import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {ConverterService, DateConverter} from "../../../src/converters";

describe("DateConverter", () => {
  const date = new Date();
  let dateConverter: DateConverter;
  before(
    PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
      dateConverter = converterService.getConverter<DateConverter>(Date)!;
    })
  );
  after(PlatformTest.reset);

  it("should do something", () => {
    expect(!!dateConverter).to.be.true;
  });

  describe("deserialize()", () => {
    it("should deserialize date as string to a Date", () => {
      expect(dateConverter.deserialize(date.toISOString())).to.be.an.instanceOf(Date);
    });

    it("should deserialize date as string to a Date", () => {
      const newDate = dateConverter.deserialize(date.toISOString());
      expect(newDate.getFullYear()).to.equals(newDate.getFullYear());
    });
  });

  describe("serialize()", () => {
    it("should serialize data to a string", () => {
      expect(dateConverter.serialize(date)).to.be.a("string").and.to.equals(date.toISOString());
    });
  });
});
