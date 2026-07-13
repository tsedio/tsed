import {TemporalMapper} from "./TemporalMapper.js";

const Temporal = (globalThis as any).Temporal;
const hasTemporal = typeof Temporal !== "undefined";

// Temporal is only available on Temporal-capable runtimes (e.g. Node >= 24).
describe.skipIf(!hasTemporal)("TemporalMapper", () => {
  describe("deserialize()", () => {
    it("should rebuild a Temporal.Instant from an ISO string", () => {
      const mapper = new TemporalMapper();
      const instant = Temporal.Instant.from("2024-01-15T14:30:00Z");

      const value = mapper.deserialize(instant.toString(), {type: Temporal.Instant} as any);

      expect(Temporal.Instant.compare(value, instant)).toEqual(0);
    });

    it("should rebuild the type read from ctx.type (PlainDate)", () => {
      const mapper = new TemporalMapper();
      const date = Temporal.PlainDate.from("2024-01-15");

      const value = mapper.deserialize(date.toString(), {type: Temporal.PlainDate} as any);

      expect(Temporal.PlainDate.compare(value, date)).toEqual(0);
    });

    it("should rebuild a Temporal.Duration", () => {
      const mapper = new TemporalMapper();
      const duration = Temporal.Duration.from({hours: 2, minutes: 30});

      const value = mapper.deserialize(duration.toString(), {type: Temporal.Duration} as any);

      expect(value.toString()).toEqual(duration.toString());
    });

    it("should return value when the data is a boolean/null/undefined", () => {
      const mapper = new TemporalMapper();

      expect(mapper.deserialize(false, {type: Temporal.Instant} as any)).toEqual(false);
      expect(mapper.deserialize(true, {type: Temporal.Instant} as any)).toEqual(true);
      expect(mapper.deserialize(null, {type: Temporal.Instant} as any)).toEqual(null);
      expect(mapper.deserialize(undefined, {type: Temporal.Instant} as any)).toBeUndefined();
    });
  });

  describe("serialize()", () => {
    it("should serialize a Temporal value to its ISO string", () => {
      const mapper = new TemporalMapper();
      const instant = Temporal.Instant.from("2024-01-15T14:30:00Z");

      expect(mapper.serialize(instant)).toEqual(instant.toString());
    });

    it("should return value when the object is null/undefined", () => {
      const mapper = new TemporalMapper();

      expect(mapper.serialize(null)).toEqual(null);
      expect(mapper.serialize(undefined)).toBeUndefined();
    });
  });
});
