import {Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";

import {Server} from "./app/Server.js";

@Controller("/:campaignID/polls")
export class PollCtrl {
  @Get("/:pollId")
  get() {}
}

@Controller({path: "/:orgName/campaigns", children: [PollCtrl]})
export class CampaignCtrl {}

@Controller({
  path: "/orgs",
  children: [CampaignCtrl]
})
export class OrgCtrl {}

describe("Swagger integration", () => {
  describe("OpenSpec2", () => {
    let request: SuperTest.Agent;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        adapter: PlatformExpress,
        mount: {
          "/api/v1": [OrgCtrl]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should generate the right spec", async () => {
      const response = await request.get("/v2/doc/swagger.json").expect(200);

      expect(response.body).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Swagger title",
          version: "1.2.0"
        },
        paths: {
          "/api/v1/orgs/{orgName}/campaigns/{campaignID}/polls/{pollId}": {
            get: {
              operationId: "pollCtrlGet",
              parameters: [
                {
                  in: "path",
                  name: "orgName",
                  required: true,
                  type: "string"
                },
                {
                  in: "path",
                  name: "campaignID",
                  required: true,
                  type: "string"
                },
                {
                  in: "path",
                  name: "pollId",
                  required: true,
                  type: "string"
                }
              ],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["PollCtrl"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "PollCtrl"
          }
        ]
      });
    });
  });
});
