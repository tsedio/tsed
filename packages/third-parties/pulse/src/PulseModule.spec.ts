import type {Job} from "@pulsecron/pulse";
import {destroyInjector, Inject} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {PlatformTest} from "@tsed/platform-http/testing";

import {Define} from "./decorators/define.js";
import {Every} from "./decorators/every.js";
import {JobsController} from "./decorators/pulse.js";
import {PulseModule} from "./services/PulseService.js";

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
      on = vi.fn();
      cancel = vi.fn();
    }
  };
});

@JobsController({namespace: "test-nsp"})
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

@JobsController({namespace: "test-nsp-2"})
class CustomCampaign2 {
  @Define({name: "customName"})
  test(job: Job) {
    // test
    return "hello " + job.attrs.name;
  }
}

@JobsController({namespace: "test-nsp-3"})
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

        await $asyncEmit("$afterListen");

        expect((pulseModule as any).$define).toHaveBeenCalledWith("test-nsp.test", expect.any(Function), {});
        expect(pulseModule.every).toHaveBeenCalledWith("60 seconds", "test-nsp.test", {}, {});
        expect(pulseModule.start).toHaveBeenCalledWith();
        expect(pulseModule.create).toHaveBeenCalledWith("customName2", {locale: "fr-FR"});

        expect(campaign.job.repeatEvery).toHaveBeenCalledWith("1 week");
        expect(campaign.job.save).toHaveBeenCalledWith();

        const result = await (pulseModule as any).$define.mock.calls[0][1]({
          attrs: {
            name: "test-nsp.test"
          }
        });

        expect(result).toEqual("hello test-nsp.test");
      });
    });

    describe("$onDestroy()", () => {
      it("should close pulse", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;

        await destroyInjector();

        expect(pulseModule.stop).toHaveBeenCalledWith();
        expect(pulseModule.close).toHaveBeenCalledWith({force: true});
      });
    });

    describe("cancel()", () => {
      it("should call pulse.cancel", async () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;
        pulseModule.cancel = vi.fn().mockResolvedValue(42);

        const result = await pulseModule.cancel({});

        expect(pulseModule.cancel).toHaveBeenCalledWith({});
        expect(result).toEqual(42);
      });
    });
    describe("on()", () => {
      it("should call pulse.on", () => {
        const pulseModule = PlatformTest.get<any>(PulseModule)!;
        const listener = vi.fn();

        pulseModule.on("fail", listener);

        expect(pulseModule.on).toHaveBeenCalledWith("fail", listener);
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

        await destroyInjector();

        expect(pulseModule.drain).toHaveBeenCalledWith();
        expect(pulseModule.close).toHaveBeenCalledWith({force: true});
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

        await $asyncEmit("$afterListen");

        expect((pulseModule as any).$define).not.toHaveBeenCalled();
        expect(pulseModule.every).not.toHaveBeenCalled();
        expect(pulseModule.start).toHaveBeenCalledWith();
        expect(pulseModule.create).not.toHaveBeenCalled();

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

        await $asyncEmit("$afterListen");

        expect((pulseModule as any).$define).toBeDefined();

        expect(campaign.job).toBeUndefined();
      });
    });
  });
});
