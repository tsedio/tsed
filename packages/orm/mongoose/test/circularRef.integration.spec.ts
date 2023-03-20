import {Injectable, PlatformTest} from "@tsed/common";
import {Inject} from "@tsed/di";
import {MongooseModel} from "@tsed/mongoose";
import {getJsonSchema} from "@tsed/schema";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {TestContract} from "./helpers/models/Contract";
import {TestCustomer} from "./helpers/models/Customer";
import {SelfUser} from "./helpers/models/User";

@Injectable()
class MyService {
  @Inject(TestContract)
  contract: MongooseModel<TestContract>;

  @Inject(TestCustomer)
  customer: MongooseModel<TestCustomer>;

  @Inject(SelfUser)
  user: MongooseModel<SelfUser>;
}

describe("Circular Ref", () => {
  beforeEach(TestMongooseContext.create);
  afterEach(TestMongooseContext.reset);
  it("should load models with his schema", async () => {
    const service = await PlatformTest.invoke<MyService>(MyService);

    expect(!!service.contract).toBe(true);
    expect(!!service.customer).toBe(true);

    expect(getJsonSchema(TestContract)).toEqual({
      definitions: {
        SelfUser: {
          properties: {
            _id: {
              description: "An ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              pattern: "^[0-9a-fA-F]{24}$",
              type: "string"
            },
            createdBy: {
              oneOf: [
                {
                  description: "A reference ObjectID",
                  examples: ["5ce7ad3028890bd71749d477"],
                  type: "string"
                },
                {
                  $ref: "#/definitions/SelfUser"
                }
              ]
            }
          },
          type: "object"
        },
        TestClient: {
          properties: {
            _id: {
              description: "An ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              pattern: "^[0-9a-fA-F]{24}$",
              type: "string"
            },
            users: {
              oneOf: [
                {
                  description: "A reference ObjectID",
                  examples: ["5ce7ad3028890bd71749d477"],
                  type: "string"
                },
                {
                  $ref: "#/definitions/SelfUser"
                }
              ]
            }
          },
          type: "object"
        },
        TestContract: {
          properties: {
            _id: {
              description: "An ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              pattern: "^[0-9a-fA-F]{24}$",
              type: "string"
            },
            customer: {
              oneOf: [
                {
                  description: "A reference ObjectID",
                  examples: ["5ce7ad3028890bd71749d477"],
                  type: "string"
                },
                {
                  $ref: "#/definitions/TestCustomer"
                }
              ]
            }
          },
          type: "object"
        },
        TestCustomer: {
          properties: {
            _id: {
              description: "An ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              pattern: "^[0-9a-fA-F]{24}$",
              type: "string"
            },
            client: {
              oneOf: [
                {
                  description: "A reference ObjectID",
                  examples: ["5ce7ad3028890bd71749d477"],
                  type: "string"
                },
                {
                  $ref: "#/definitions/TestClient"
                }
              ]
            },
            contracts: {
              items: {
                oneOf: [
                  {
                    description: "A reference ObjectID",
                    examples: ["5ce7ad3028890bd71749d477"],
                    type: "string"
                  },
                  {
                    $ref: "#/definitions/TestContract"
                  }
                ]
              },
              type: "array"
            }
          },
          type: "object"
        }
      },
      properties: {
        _id: {
          description: "An ObjectID",
          examples: ["5ce7ad3028890bd71749d477"],
          pattern: "^[0-9a-fA-F]{24}$",
          type: "string"
        },
        customer: {
          oneOf: [
            {
              description: "A reference ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              type: "string"
            },
            {
              $ref: "#/definitions/TestCustomer"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should resolve correctly a self reference", async () => {
    const service = await PlatformTest.invoke<MyService>(MyService);

    expect(!!service.user).toBe(true);

    expect(getJsonSchema(SelfUser)).toEqual({
      definitions: {
        SelfUser: {
          properties: {
            _id: {
              description: "An ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              pattern: "^[0-9a-fA-F]{24}$",
              type: "string"
            },
            createdBy: {
              oneOf: [
                {
                  description: "A reference ObjectID",
                  examples: ["5ce7ad3028890bd71749d477"],
                  type: "string"
                },
                {
                  $ref: "#/definitions/SelfUser"
                }
              ]
            }
          },
          type: "object"
        }
      },
      properties: {
        _id: {
          description: "An ObjectID",
          examples: ["5ce7ad3028890bd71749d477"],
          pattern: "^[0-9a-fA-F]{24}$",
          type: "string"
        },
        createdBy: {
          oneOf: [
            {
              description: "A reference ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              type: "string"
            },
            {
              $ref: "#/definitions/SelfUser"
            }
          ]
        }
      },
      type: "object"
    });
  });
});
