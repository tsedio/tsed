import {MongoBackend} from "@agendajs/mongo-backend";
import {Inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import {Agenda, type Job} from "agenda";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {AgendaModule, AgendaService, Define, JobsController} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@JobsController({namespace: "test-nsp"})
class Test {
  @Inject()
  agenda!: AgendaModule;

  jobs!: Job<{locale: string}>[];

  @Define({name: "customName"})
  test2(job: Job<{locale: string}>) {
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
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: {
          enabled: true,
          backend: new MongoBackend({
            address: options.url,
            options: options.connectionOptions as never
          })
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      await PlatformTest.reset();
      await TestContainersMongo.reset();
    });

    it("should have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      expect(Object.keys(agenda.definitions)).toEqual(["test-nsp.customName"]);
    });

    it("should schedule defined job and run it", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      const job = await agenda.now("test-nsp.customName", {
        locale: "fr-FR"
      });
      const {jobs: runnedJobs} = await agenda.queryJobs({id: String(job.attrs._id)});
      expect(runnedJobs[0]._id).toStrictEqual(job.attrs._id);
      expect((runnedJobs[0].data as {locale: string}).locale).toEqual("fr-FR");
    });
  });

  describe("disabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterAll(() => TestContainersMongo.reset());

    it("should have job definitions thanks to Proxy", () => {
      const agenda = PlatformTest.injector.get(Agenda)!;
      expect(agenda.definitions).toBeDefined();
    });
  });

  describe("enabled but job processing is disabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: {
          enabled: true,
          disableJobProcessing: true,
          backend: new MongoBackend({
            address: options.url,
            options: options.connectionOptions as never
          })
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      await PlatformTest.reset();
      await TestContainersMongo.reset();
    });

    it("should not have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      expect(Object.keys(agenda.definitions)).toEqual([]);
    });

    it("should schedule job but not run it", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      const job = await agenda.now("test-nsp.customName", {});
      const {jobs: runnedJobs} = await agenda.queryJobs({id: String(job.attrs._id)});
      expect(runnedJobs[0].lastRunAt).toBeUndefined();
    });
  });
});
