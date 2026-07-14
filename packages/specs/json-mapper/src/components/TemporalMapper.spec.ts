import {JsonMapperCtx} from "../interfaces/JsonMapperMethods.js";
import {TemporalMapper} from "./TemporalMapper.js";

describe("TemporalMapper", () => {
  describe("deserialize()", () => {
    it("should rebuild a Temporal.Instant from an ISO string", () => {
      const mapper = new TemporalMapper();
      const instant = Temporal.Instant.from("2024-01-15T14:30:00Z");

      const value = mapper.deserialize(instant.toString(), {type: Temporal.Instant} as JsonMapperCtx) as Temporal.Instant;

      expect(Temporal.Instant.compare(value, instant)).toEqual(0);
    });

    it("should rebuild the type read from ctx.type (PlainDate)", () => {
      const mapper = new TemporalMapper();
      const date = Temporal.PlainDate.from("2024-01-15");

      const value = mapper.deserialize(date.toString(), {type: Temporal.PlainDate} as JsonMapperCtx) as Temporal.PlainDate;

      expect(Temporal.PlainDate.compare(value, date)).toEqual(0);
    });

    it("should rebuild a Temporal.Duration", () => {
      const mapper = new TemporalMapper();
      const duration = Temporal.Duration.from({hours: 2, minutes: 30});

      const value = mapper.deserialize(duration.toString(), {type: Temporal.Duration} as JsonMapperCtx) as Temporal.Duration;

      expect(value.toString()).toEqual(duration.toString());
    });

    it("should rebuild a Temporal.ZonedDateTime with time zone", () => {
      const mapper = new TemporalMapper();
      const zdt = Temporal.ZonedDateTime.from("2024-06-15T10:00:00[Europe/Paris]");

      const value = mapper.deserialize(zdt.toString(), {type: Temporal.ZonedDateTime} as JsonMapperCtx) as Temporal.ZonedDateTime;

      expect(Temporal.ZonedDateTime.compare(value, zdt)).toEqual(0);
      expect(mapper.serialize(value)).toEqual(zdt.toString({fractionalSecondDigits: 3}));
    });

    it("should return value when the data is a boolean/null/undefined", () => {
      const mapper = new TemporalMapper();

      expect(mapper.deserialize(false, {type: Temporal.Instant} as JsonMapperCtx)).toEqual(false);
      expect(mapper.deserialize(true, {type: Temporal.Instant} as JsonMapperCtx)).toEqual(true);
      expect(mapper.deserialize(null, {type: Temporal.Instant} as JsonMapperCtx)).toEqual(null);
      expect(mapper.deserialize(undefined, {type: Temporal.Instant} as JsonMapperCtx)).toBeUndefined();
    });
  });

  describe("serialize()", () => {
    it("should serialize a time-bearing Temporal value at millisecond precision", () => {
      const mapper = new TemporalMapper();

      // sub-millisecond precision is truncated to milliseconds (like Date#toISOString)
      expect(mapper.serialize(Temporal.Instant.from("2024-01-15T14:30:00.195360107Z"))).toEqual("2024-01-15T14:30:00.195Z");
      // whole seconds still render three fractional digits
      expect(mapper.serialize(Temporal.Instant.from("2024-01-15T14:30:00Z"))).toEqual("2024-01-15T14:30:00.000Z");
      expect(mapper.serialize(Temporal.PlainDateTime.from("2024-01-15T14:30:00.195360107"))).toEqual("2024-01-15T14:30:00.195");
      expect(mapper.serialize(Temporal.PlainTime.from("14:30:00.195360107"))).toEqual("14:30:00.195");
      expect(mapper.serialize(Temporal.ZonedDateTime.from("2024-06-15T10:00:00.195360107[Europe/Paris]"))).toEqual(
        "2024-06-15T10:00:00.195+02:00[Europe/Paris]"
      );
    });

    it("should serialize date-only and duration values with their default toString", () => {
      const mapper = new TemporalMapper();

      expect(mapper.serialize(Temporal.PlainDate.from("2024-01-15"))).toEqual("2024-01-15");
      expect(mapper.serialize(Temporal.PlainYearMonth.from("2024-01"))).toEqual("2024-01");
      expect(mapper.serialize(Temporal.PlainMonthDay.from("01-15"))).toEqual("01-15");
      expect(mapper.serialize(Temporal.Duration.from({hours: 2, minutes: 30}))).toEqual("PT2H30M");
    });

    it("should return value when the object is null/undefined", () => {
      const mapper = new TemporalMapper();

      expect(mapper.serialize(null)).toEqual(null);
      expect(mapper.serialize(undefined)).toBeUndefined();
    });
  });
});
