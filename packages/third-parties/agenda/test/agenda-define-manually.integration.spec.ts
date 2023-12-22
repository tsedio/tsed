import {PlatformTest} from "@tsed/common";
import {Inject} from "@tsed/di";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Job} from "agenda";
import {AgendaModule, Agenda, AgendaService, Define} from "../src/index";
import {Server} from "./helpers/Server";

@Agenda({namespace: "test-nsp"})
class Test {
  @Inject()
  agenda: AgendaModule;

  jobs: Job[];

  @Define({name: "customName"})
  test2(job: Job) {
    // test
    expect(job.attrs.data.locale).toBeDefined();
  }

  $beforeAgendaStart() {
    const locales = ["fr-FR", "en-US"];

    this.jobs = locales.map((locale) => {
      return this.agenda.create("customName", {
        locale
      });
    });
  }

  $afterAgendaStart() {
    return Promise.all(this.jobs.map((job) => job.repeatEvery("1 week").save()));
  }
}

describe("Agenda integration", () => {
  describe("enabled", () => {
    beforeAll(async () => {
      await TestMongooseContext.install();
      const {url} = await TestMongooseContext.getMongooseOptions();
      const bstrp = PlatformTest.bootstrap(Server, {
        agenda: {
          enabled: true,
          db: {
            address: url,
            options: {}
          }
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await TestMongooseContext.reset();
      await agenda._db.close();
    });

    it("should have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      expect(Object.keys(agenda._definitions)).toEqual(["test-nsp.test", "test-nsp.customName"]);
    });

    it("should schedule cron-like jobs", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      const jobs = await agenda.jobs();

      const job1 = jobs.find((job: any) => job.attrs.name.includes("test-nsp.test"));

      expect(job1?.attrs.repeatInterval).toEqual("1 week");
    });

    it("should schedule defined job and run it", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      const job = await agenda.now("test-nsp.customName", {});
      const runnedJob = await agenda.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs._id).toStrictEqual(job.attrs._id);
      expect(runnedJob[0].attrs.lastRunAt).toBeDefined();
      expect(runnedJob[0].attrs.data.locale).toEqual("fr-FR");
    });
  });

  describe("disabled", () => {
    beforeAll(async () => {
      await TestMongooseContext.install();
      const bstrp = PlatformTest.bootstrap(Server, {
        agenda: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterAll(() => TestMongooseContext.reset());

    it("should not have job definitions", () => {
      const agenda = PlatformTest.injector.get(AgendaService)!;
      expect(agenda._definitions).toBeUndefined();
    });

    it("should fail to schedule a job", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await expect(() => agenda.now("test-nsp.customName", {})).rejects.toThrowError(TypeError);
    });
  });

  describe("enabled but job processing is disabled", () => {
    beforeAll(async () => {
      await TestMongooseContext.install();
      const {url} = await TestMongooseContext.getMongooseOptions();
      const bstrp = PlatformTest.bootstrap(Server, {
        agenda: {
          enabled: true,
          disableJobProcessing: true,
          db: {
            address: url,
            options: {}
          }
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await TestMongooseContext.reset();
      await agenda._db.close();
    });

    it("should not have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      expect(Object.keys(agenda._definitions)).toEqual([]);
    });

    it("should schedule job but not run it", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      const job = await agenda.now("test-nsp.customName", {});
      const runnedJob = await agenda.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs.lastRunAt).toBeUndefined();
    });
  });
});
