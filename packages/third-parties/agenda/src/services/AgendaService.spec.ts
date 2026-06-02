import {destroyInjector, Inject} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Agenda, type Job} from "agenda";

import {Define} from "../decorators/define.js";
import {Every} from "../decorators/every.js";
import {JobsController} from "../decorators/jobController.js";
import {AgendaService} from "./AgendaService.js";

vi.mock("agenda", () => {
  return {
    Agenda: class {
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
      constructor() {}
    }
  };
});

const backend = {
  repository: {},
  connect: vi.fn().mockResolvedValue(undefined),
  disconnect: vi.fn().mockResolvedValue(undefined)
};

@JobsController({namespace: "test-nsp"})
class CustomCampaign {
  @Inject()
  agenda!: Agenda;

  job!: Job;

  $beforeAgendaStart() {
    this.job = this.agenda.create("customName2", {
      locale: "fr-FR"
    });
  }

  $afterAgendaStart() {
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

describe("AgendaService", () => {
  describe("when agenda is enabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: {
          enabled: true,
          backend: backend as never
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaService)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await $asyncEmit("$afterListen");

        expect((agendaModule as any).$define).toHaveBeenCalledWith("test-nsp.test", expect.any(Function), {});
        expect(agendaModule.every).toHaveBeenCalledWith("60 seconds", "test-nsp.test", {}, {});
        expect(agendaModule.start).toHaveBeenCalledWith();
        expect(agendaModule.create).toHaveBeenCalledWith("customName2", {locale: "fr-FR"});

        expect(campaign.job.repeatEvery).toHaveBeenCalledWith("1 week");
        expect(campaign.job.save).toHaveBeenCalledWith();

        const result = await (agendaModule as any).$define.mock.calls[0][1]({
          attrs: {
            name: "test-nsp.test"
          }
        });

        expect(result).toEqual("hello test-nsp.test");
      });
    });

    describe("$onDestroy()", () => {
      it("should close agenda", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaService)!;

        await destroyInjector();

        expect(agendaModule.stop).toHaveBeenCalledWith();
      });
    });

    describe("cancel()", () => {
      it("should call agenda.cancel", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaService)!;
        agendaModule.agenda.cancel = vi.fn().mockResolvedValue(42);

        const result = await agendaModule.cancel({});

        expect(agendaModule.agenda.cancel).toHaveBeenCalledWith({});
        expect(result).toEqual(42);
      });
    });
    describe("on()", () => {
      it("should call agenda.on", () => {
        const agendaModule = PlatformTest.get<any>(AgendaService)!;
        const listener = vi.fn();

        agendaModule.on("fail", listener);

        expect(agendaModule.agenda.on).toHaveBeenCalledWith("fail", listener);
      });
    });
  });
  describe("when agenda is enabled and drainJobsBeforeClose = true", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: {
          enabled: true,
          drainJobsBeforeClose: true,
          backend: backend as never
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    describe("$onDestroy()", () => {
      it("should close agenda", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaService)!;

        await destroyInjector();

        expect(agendaModule.drain).toHaveBeenCalledWith();
      });
    });
  });
  describe("when agenda is enabled but disableJobProcessing = true", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: {
          enabled: true,
          disableJobProcessing: true,
          backend: backend as never
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaService)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await $asyncEmit("$afterListen");

        expect((agendaModule as any).$define).not.toHaveBeenCalled();
        expect(agendaModule.every).not.toHaveBeenCalled();
        expect(agendaModule.start).toHaveBeenCalledWith();
        expect(agendaModule.create).not.toHaveBeenCalled();

        expect(campaign.job).toBeUndefined();
      });
    });
  });

  describe("when agenda is disabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: false as never
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const agendaModule = PlatformTest.get<any>(Agenda)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await $asyncEmit("$afterListen");

        expect(agendaModule.define).toBeDefined();

        expect(campaign.job).toBeUndefined();
      });
    });
  });
});
