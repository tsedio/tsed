import {Controller, Get, PathParams, PlatformTest, ProviderScope, Scope, Service} from "@tsed/common";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

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
  async testPerRequest(@PathParams("id") userId: string): Promise<any> {
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

export function testScopeRequest(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [ScopeRequestCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

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
        expect(responses).to.deep.eq([
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
