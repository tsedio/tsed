import {Injectable, PlatformTest} from "@tsed/common";
import {Inject} from "@tsed/di";
import {getJsonSchema} from "@tsed/schema/src";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {MongooseModel} from "../src";
import {TestContract} from "./helpers/models/Contract";
import {TestCustomer} from "./helpers/models/Customer";

@Injectable()
class MyService {
  @Inject(TestContract)
  contract: MongooseModel<TestContract>;

  @Inject(TestCustomer)
  customer: MongooseModel<TestCustomer>;
}

describe("Circular Ref", () => {
  beforeEach(TestMongooseContext.create);
  afterEach(TestMongooseContext.reset);
  it("should load models with his schema", async () => {
    const service = await PlatformTest.invoke<MyService>(MyService);

    expect(!!service.contract).to.be.true;
    expect(!!service.customer).to.be.true;

    expect(getJsonSchema(TestContract)).to.deep.equal({
      "definitions": {
        "TestContract": {
          "properties": {
            "_id": {
              "description": "Mongoose ObjectId",
              "examples": [
                "5ce7ad3028890bd71749d477"
              ],
              "pattern": "^[0-9a-fA-F]{24}$",
              "type": "string"
            },
            "customer": {
              "oneOf": [
                {
                  "description": "Mongoose Ref ObjectId",
                  "examples": [
                    "5ce7ad3028890bd71749d477"
                  ],
                  "type": "string"
                },
                {
                  "$ref": "#/definitions/TestCustomer"
                }
              ]
            }
          },
          "type": "object"
        },
        "TestCustomer": {
          "properties": {
            "_id": {
              "description": "Mongoose ObjectId",
              "examples": [
                "5ce7ad3028890bd71749d477"
              ],
              "pattern": "^[0-9a-fA-F]{24}$",
              "type": "string"
            },
            "contracts": {
              "items": {
                "oneOf": [
                  {
                    "description": "Mongoose Ref ObjectId",
                    "examples": [
                      "5ce7ad3028890bd71749d477"
                    ],
                    "type": "string"
                  },
                  {
                    "$ref": "#/definitions/TestContract"
                  }
                ]
              },
              "type": "array"
            }
          },
          "type": "object"
        }
      },
      "properties": {
        "_id": {
          "description": "Mongoose ObjectId",
          "examples": [
            "5ce7ad3028890bd71749d477"
          ],
          "pattern": "^[0-9a-fA-F]{24}$",
          "type": "string"
        },
        "customer": {
          "oneOf": [
            {
              "description": "Mongoose Ref ObjectId",
              "examples": [
                "5ce7ad3028890bd71749d477"
              ],
              "type": "string"
            },
            {
              "$ref": "#/definitions/TestCustomer"
            }
          ]
        }
      },
      "type": "object"
    });
  });
});