import {Inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import type {Job} from "agenda";

import {AgendaModule} from "./AgendaModule.js";
import {Agenda} from "./decorators/agenda.js";
import {Define} from "./decorators/define.js";
import {Every} from "./decorators/every.js";

vi.mock("agenda", () => {
  return {
    Agenda: class {
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

@Agenda({namespace: "test-nsp"})
class CustomCampaign {
  @Inject()
  agenda: AgendaModule;

  job: Job;

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

@Agenda({namespace: "test-nsp-2"})
class CustomCampaign2 {
  @Define({name: "customName"})
  test(job: Job) {
    // test
    return "hello " + job.attrs.name;
  }
}

@Agenda({namespace: "test-nsp-3"})
class CustomCampaign3 {}

describe("AgendaModule", () => {
  describe("when agenda is enabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: {
          enabled: true
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await agendaModule.$afterListen();

        expect(agendaModule.agenda.define).toHaveBeenCalledWith("test-nsp.test", {}, expect.any(Function));
        expect(agendaModule.agenda.every).toHaveBeenCalledWith("60 seconds", "test-nsp.test", {}, {});
        expect(agendaModule.agenda.start).toHaveBeenCalledWith();
        expect(agendaModule.agenda.create).toHaveBeenCalledWith("customName2", {locale: "fr-FR"});

        expect(campaign.job.repeatEvery).toHaveBeenCalledWith("1 week");
        expect(campaign.job.save).toHaveBeenCalledWith();

        const result = await agendaModule.agenda.define.mock.calls[0][2]({
          attrs: {
            name: "test-nsp.test"
          }
        });

        expect(result).toEqual("hello test-nsp.test");
      });
    });
    describe("schedule()", () => {
      it("should schedule a job", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;

        await agendaModule.schedule("now", "test-nsp.test", {});

        expect(agendaModule.agenda.schedule).toHaveBeenCalledWith("now", "test-nsp.test", {});
      });
    });

    describe("now()", () => {
      it("should schedule a job", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;

        await agendaModule.now("test-nsp.test", {});

        expect(agendaModule.agenda.now).toHaveBeenCalledWith("test-nsp.test", {});
      });
    });
    describe("$onDestroy()", () => {
      it("should close agenda", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;

        await agendaModule.$onDestroy();

        expect(agendaModule.agenda.stop).toHaveBeenCalledWith();
        expect(agendaModule.agenda.close).toHaveBeenCalledWith({force: true});
      });
    });
  });
  describe("when agenda is enabled and drainJobsBeforeClose = true", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: {
          enabled: true,
          drainJobsBeforeClose: true
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    describe("$onDestroy()", () => {
      it("should close agenda", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;

        await agendaModule.$onDestroy();

        expect(agendaModule.agenda.drain).toHaveBeenCalledWith();
        expect(agendaModule.agenda.close).toHaveBeenCalledWith({force: true});
      });
    });
  });
  describe("when agenda is enabled but disableJobProcessing = true", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: {
          enabled: true,
          disableJobProcessing: true
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await agendaModule.$afterListen();

        expect(agendaModule.agenda.define).not.toHaveBeenCalled();
        expect(agendaModule.agenda.every).not.toHaveBeenCalled();
        expect(agendaModule.agenda.start).toHaveBeenCalledWith();
        expect(agendaModule.agenda.create).not.toHaveBeenCalled();

        expect(campaign.job).toBeUndefined();
      });
    });
  });

  describe("when agenda is disabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        agenda: {
          enabled: false
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    describe("$afterListen()", () => {
      it("should load all jobs", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;
        const campaign = PlatformTest.get<CustomCampaign>(CustomCampaign)!;

        await agendaModule.$afterListen();

        expect(agendaModule.agenda.define).toBeUndefined();

        expect(campaign.job).toBeUndefined();
      });
    });

    describe("$onDestroy()", () => {
      it("should do nothing", async () => {
        const agendaModule = PlatformTest.get<any>(AgendaModule)!;

        await agendaModule.$onDestroy();
      });
    });
  });
});
