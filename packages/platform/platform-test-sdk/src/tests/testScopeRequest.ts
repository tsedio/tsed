import {Controller, ProviderScope, Scope, Service} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Service()
@Scope(ProviderScope.REQUEST)
export class ScopeRequestService {
  user: string;
}

@Controller("/scopes-request")
@Scope(ProviderScope.REQUEST)
export class ScopeRequestCtrl {
  userId: string | null;

  constructor(public scopeRequestService: ScopeRequestService) {}

  $onDestroy() {
    this.userId = null;
  }

  @Get("/:id")
  testPerRequest(@PathParams("id") userId: string): Promise<any> {
    this.scopeRequestService.user = userId;
    this.userId = userId;

    return new Promise((resolve, reject) => {
      if (userId === "0") {
        setTimeout(() => {
          resolve({userId, idSrv: this.scopeRequestService.user, idCtrl: this.userId});
        }, 500);
      }

      if (userId === "1") {
        setTimeout(() => {
          resolve({userId, idSrv: this.scopeRequestService.user, idCtrl: this.userId});
        }, 300);
      }

      if (userId === "2") {
        setTimeout(() => {
          resolve({userId, idSrv: this.scopeRequestService.user, idCtrl: this.userId});
        }, 150);
      }
    });
  }
}

export function testScopeRequest(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [ScopeRequestCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("GET /rest/scopes-request/:id", () => {
    const send = (id: string) =>
      new Promise((resolve, reject) => {
        request
          .get(`/rest/scopes-request/${id}`)
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              reject(err);
            } else {
              resolve({id, ...JSON.parse(response.text)});
            }
          });
      });

    it("should respond with the right userId per request", () => {
      const promises = [];

      promises.push(send("0"));
      promises.push(send("1"));
      promises.push(send("2"));

      return Promise.all(promises).then((responses) => {
        expect(responses).toEqual([
          {
            id: "0",
            idCtrl: "0",
            idSrv: "0",
            userId: "0"
          },
          {
            id: "1",
            idCtrl: "1",
            idSrv: "1",
            userId: "1"
          },
          {
            id: "2",
            idCtrl: "2",
            idSrv: "2",
            userId: "2"
          }
        ]);
      });
    });
  });
}
