import {Inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import type {Job} from "agenda";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {Agenda, AgendaModule, AgendaService, Define} from "../src/index.js";
import {Server} from "./helpers/Server.js";

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
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: {
          enabled: true,
          db: {
            address: options.url,
            options: options.connectionOptions as never
          }
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await TestContainersMongo.reset();
      await agenda._db?.close();
    });

    it("should have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      expect(Object.keys(agenda._definitions)).toEqual(["test-nsp.customName"]);
    });

    it("should schedule defined job and run it", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      const job = await agenda.now("test-nsp.customName", {
        locale: "fr-FR"
      });
      const runnedJob = await agenda.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs._id).toStrictEqual(job.attrs._id);
      expect(runnedJob[0].attrs.data.locale).toEqual("fr-FR");
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

    it("should not have job definitions", () => {
      const agenda = PlatformTest.injector.get(AgendaService)!;
      expect(agenda._definitions).toBeUndefined();
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
          db: {
            address: options.url,
            options: options.connectionOptions as never
          }
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await TestContainersMongo.reset();
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
