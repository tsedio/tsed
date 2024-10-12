import type {Job} from "@pulsecron/pulse";
import {Inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {Define} from "./decorators/define.js";
import {Every} from "./decorators/every.js";
import {Pulse} from "./decorators/pulse.js";
import {PulseModule} from "./PulseModule.js";

vi.mock("@pulsecron/pulse", () => {
  return {
    Pulse: class {
      close = vi.fn();
      stop = vi.fn();
      drain = vi.fn();
      define = vi.fn();
      every = vi.fn();
      schedule = vi.fn();
      now = vi.fn();
      create = vi.fn().mockReturnValue({
        repeatEvery: vi.fn().mockReturnThis(),
        save: vi.fn()
      });
      start = vi.fn();
    }
  };
});

@Pulse({namespace: "test-nsp"})
class CustomCampaign {
  @Inject()
  pulse: PulseModule;

  job: Job;

  $beforePulseStart() {
    this.job = this.pulse.create("customName2", {
      locale: "fr-FR"
    });
  }

  $afterPulseStart() {
    return this.job.repeatEvery("1 week").save();
  }

  @Every("60 seconds")
  test(job: Job) {
    // test
    return "hello " + job.attrs.name;
  }

  @Define({name: "customName"})
  test2(job: Job) {
    // test
    return "hello " + job.attrs.name;
  }

  @Define({name: "customName2"})
  test3() {
    // test
  }
}

@Pulse({namespace: "test-nsp-2"})
class CustomCampaign2 {
  @Define({name: "customName"})
  test(job: Job) {
    // test
    return "hello " + job.attrs.name;
  }
}

@Pulse({namespace: "test-nsp-3"})
class CustomCampaign3 {}

describe("PulseModule", () => {
  describe("when pulse is enabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        pulse: {
          enabled: true
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await pulseModule.$afterListen();

        expect(pulseModule.pulse.define).toHaveBeenCalledWith("test-nsp.test", expect.any(Function), {});
        expect(pulseModule.pulse.every).toHaveBeenCalledWith("60 seconds", "test-nsp.test", {}, {});
        expect(pulseModule.pulse.start).toHaveBeenCalledWith();
        expect(pulseModule.pulse.create).toHaveBeenCalledWith("customName2", {locale: "fr-FR"});

        expect(campaign.job.repeatEvery).toHaveBeenCalledWith("1 week");
        expect(campaign.job.save).toHaveBeenCalledWith();

        const result = await pulseModule.pulse.define.mock.calls[0][1]({
          attrs: {
            name: "test-nsp.test"
          }
        });

        expect(result).toEqual("hello test-nsp.test");
      });
    });
    describe("schedule()", () => {
      it("should schedule a job", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;

        await pulseModule.schedule("now", "test-nsp.test", {});

        expect(pulseModule.pulse.schedule).toHaveBeenCalledWith("now", "test-nsp.test", {});
      });
    });

    describe("now()", () => {
      it("should schedule a job", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;

        await pulseModule.now("test-nsp.test", {});

        expect(pulseModule.pulse.now).toHaveBeenCalledWith("test-nsp.test", {});
      });
    });
    describe("$onDestroy()", () => {
      it("should close pulse", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;

        await pulseModule.$onDestroy();

        expect(pulseModule.pulse.stop).toHaveBeenCalledWith();
        expect(pulseModule.pulse.close).toHaveBeenCalledWith({force: true});
      });
    });
  });
  describe("when pulse is enabled and drainJobsBeforeClose = true", () => {
    beforeEach(() =>
      PlatformTest.create({
        pulse: {
          enabled: true,
          drainJobsBeforeClose: true
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    describe("$onDestroy()", () => {
      it("should close pulse", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;

        await pulseModule.$onDestroy();

        expect(pulseModule.pulse.drain).toHaveBeenCalledWith();
        expect(pulseModule.pulse.close).toHaveBeenCalledWith({force: true});
      });
    });
  });
  describe("when pulse is enabled but disableJobProcessing = true", () => {
    beforeEach(() =>
      PlatformTest.create({
        pulse: {
          enabled: true,
          disableJobProcessing: true
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await pulseModule.$afterListen();

        expect(pulseModule.pulse.define).not.toHaveBeenCalled();
        expect(pulseModule.pulse.every).not.toHaveBeenCalled();
        expect(pulseModule.pulse.start).toHaveBeenCalledWith();
        expect(pulseModule.pulse.create).not.toHaveBeenCalled();

        expect(campaign.job).toBeUndefined();
      });
    });
  });

  describe("when pulse is disabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        pulse: {
          enabled: false
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await pulseModule.$afterListen();

        expect(pulseModule.pulse.define).toBeUndefined();

        expect(campaign.job).toBeUndefined();
      });
    });

    describe("$onDestroy()", () => {
      it("should do nothing", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;

        await pulseModule.$onDestroy();
      });
    });
  });
});
