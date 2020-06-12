import {Controller, PlatformTest, Post, Property, Required, BodyParams} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {TestServer} from "./helpers/TestServer";

class BodyParamModel {
  @Property()
  id: string;

  @Property()
  name: string;
}

@Controller("/")
export class BodyCtrl {
  @Post("/test-scenario-1")
  testScenario1(@BodyParams("test") value: string[]): any {
    return {value};
  }

  @Post("/test-scenario-2")
  testScenario2(@BodyParams() value: string[]): any {
    return {value};
  }

  @Post("/test-scenario-3")
  testScenario3(@Required() @BodyParams("test") value: string[]): any {
    return {value};
  }

  @Post("/test-scenario-4")
  testScenario4(@BodyParams() user: BodyParamModel) {
    expect(user).to.be.instanceof(BodyParamModel);

    return user;
  }

  @Post("/test-scenario-5")
  testScenario5(@BodyParams("user") user: BodyParamModel) {
    expect(user).to.be.instanceof(BodyParamModel);

    return user;
  }

  @Post("/test-scenario-6")
  testScenario6(@BodyParams(BodyParamModel) users: BodyParamModel[]) {
    expect(users[0]).to.be.instanceof(BodyParamModel);

    return users[0];
  }

  @Post("/test-scenario-7")
  testScenario7(@BodyParams("users", BodyParamModel) users: BodyParamModel[]) {
    expect(users[0]).to.be.instanceof(BodyParamModel);

    return users[0];
  }
}

describe("Body spec", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(TestServer, {
    mount: {
      "/rest": [
        BodyCtrl
      ]
    }
  }));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: with expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/test-scenario-1")
        .send({
          test: ["value"]
        }).expect(200);

      response.body.should.be.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/test-scenario-1").send().expect(200);

      response.body.should.be.deep.equal({});
    });
    it("should return an empty value (2)", async () => {
      const response = await request.post("/rest/test-scenario-1").send({}).expect(200);

      response.body.should.be.deep.equal({});
    });
  });
  describe("Scenario2: without expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/test-scenario-2")
        .send(["value"]).expect(200);

      response.body.should.be.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/test-scenario-2").send().expect(200);

      response.body.should.be.deep.equal({value: [{}]});
    });
  });
  describe("Scenario3: with expression required Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/test-scenario-3")
        .send({test: ["value"]}).expect(200);

      response.body.should.be.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/test-scenario-3").send().expect(400);

      response.text.should.be.deep.equal("Bad request on parameter \"request.body.test\".<br />It should have required parameter 'test'");
    });
  });
  describe("Scenario4: with model", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/test-scenario-4")
        .send({
          id: "id",
          name: "name"
        })
        .expect(200);

      response.body.should.be.deep.equal({
        id: "id",
        name: "name"
      });
    });
  });
  describe("Scenario5: with model and expression", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/test-scenario-5")
        .send({
          user: {
            id: "id",
            name: "name"
          }
        })
        .expect(200);

      response.body.should.be.deep.equal({
        id: "id",
        name: "name"
      });
    });
  });
  describe("Scenario6: with Array<model>", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/test-scenario-6")
        .send([{
          id: "id",
          name: "name"
        }])
        .expect(200);

      response.body.should.be.deep.equal({
        id: "id",
        name: "name"
      });
    });
  });
  describe("Scenario7: with Array<model> and expression", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/test-scenario-7")
        .send({
          users: [
            {
              id: "id",
              name: "name"
            }
          ]
        })
        .expect(200);

      response.body.should.be.deep.equal({
        id: "id",
        name: "name"
      });
    });
  });
});
