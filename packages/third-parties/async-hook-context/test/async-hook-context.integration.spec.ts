import {Controller, Get, Inject, Injectable, PathParams, PlatformContext, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {expect} from "chai";
import faker from "@faker-js/faker";
import SuperTest from "supertest";
import {InjectContext} from "../src";
import {rootDir, Server} from "./app/Server";

@Injectable()
export class CustomRepository {
  @InjectContext()
  $ctx?: PlatformContext;

  async findById(id: string) {
    return {
      id,
      agentId: this.$ctx?.request.get("x-agent-id")
    };
  }
}

@Controller("/async-hooks")
export class AsyncHookCtrl {
  @Inject()
  repository: CustomRepository;

  @Get("/:id")
  async get(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }
}

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
});

describe("AsyncHookContext", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    utils.bootstrap({
      mount: {
        "/rest": [AsyncHookCtrl]
      }
    })
  );
  after(utils.reset);

  before(() => {
    request = SuperTest(PlatformTest.callback());
  });

  describe("GET /rest/async-hooks/1", () => {
    it("should the agentId from context request headers", async () => {
      const agentId = faker.datatype.uuid();
      const id = faker.datatype.uuid();
      const {body} = await request.get(`/rest/async-hooks/${id}`).set("x-agent-id", agentId).expect(200);

      if (require("async_hooks").AsyncLocalStorage) {
        expect(body).to.deep.eq({
          id,
          agentId
        });
      }
    });
  });
});
