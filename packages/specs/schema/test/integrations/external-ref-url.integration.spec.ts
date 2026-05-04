import {AjvService} from "@tsed/ajv";
import {PlatformTest} from "@tsed/platform-http/testing";

import {compile, s} from "../../src/index.js";

const PaymentProvidersResponseSchema = s.object({
  paymentProviders: s.$ref("https://api.clubmed.com/doc/swagger.json#/components/schemas/NotificationPayloadModel"),
  buyNowPayLaterProviders: s.$ref("https://api.clubmed.com/doc/swagger.json#/components/schemas/BuyNowPayLaterProviderModel")
});

const paymentProvidersResponseSchemaJson = compile(PaymentProvidersResponseSchema);

describe("External ref url integration", () => {
  beforeEach(() =>
    PlatformTest.create({
      ajv: {
        loadSchema: async (uri: string) => {
          if (uri === "https://api.clubmed.com/doc/swagger.json") {
            return {
              $id: uri,
              components: {
                schemas: {
                  NotificationPayloadModel: {
                    type: "object",
                    properties: {
                      id: {type: "string"},
                      amount: {type: "number"}
                    },
                    required: ["id", "amount"],
                    additionalProperties: false
                  },
                  BuyNowPayLaterProviderModel: {
                    type: "object",
                    properties: {
                      provider: {type: "string"}
                    },
                    required: ["provider"],
                    additionalProperties: false
                  }
                }
              }
            };
          }

          if (uri === "https://api.clubmed.com/doc/swagger.json#/components/schemas/NotificationPayloadModel") {
            return {
              $id: uri,
              type: "object",
              properties: {
                id: {type: "string"},
                amount: {type: "number"}
              },
              required: ["id", "amount"],
              additionalProperties: false
            };
          }

          if (uri === "https://api.clubmed.com/doc/swagger.json#/components/schemas/BuyNowPayLaterProviderModel") {
            return {
              $id: uri,
              type: "object",
              properties: {
                provider: {type: "string"}
              },
              required: ["provider"],
              additionalProperties: false
            };
          }

          throw new Error(`Unknown schema: ${uri}`);
        }
      }
    })
  );
  afterEach(() => PlatformTest.reset());

  it("should generate the appropriate schema", () => {
    expect(paymentProvidersResponseSchemaJson).toMatchInlineSnapshot(`
      {
        "properties": {
          "buyNowPayLaterProviders": {
            "$ref": "https://api.clubmed.com/doc/swagger.json#/components/schemas/BuyNowPayLaterProviderModel",
          },
          "paymentProviders": {
            "$ref": "https://api.clubmed.com/doc/swagger.json#/components/schemas/NotificationPayloadModel",
          },
        },
        "type": "object",
      }
    `);
  });

  it("should validate payload with AjvService and external refs", async () => {
    const service = PlatformTest.get<AjvService>(AjvService);

    await expect(
      service.validate(
        {
          paymentProviders: {id: "pay-1", amount: 42},
          buyNowPayLaterProviders: {provider: "klarna"}
        },
        {schema: paymentProvidersResponseSchemaJson}
      )
    ).resolves.toEqual({
      paymentProviders: {id: "pay-1", amount: 42},
      buyNowPayLaterProviders: {provider: "klarna"}
    });

    await expect(
      service.validate(
        {
          paymentProviders: {id: "pay-1"},
          buyNowPayLaterProviders: {provider: "klarna"}
        },
        {schema: paymentProvidersResponseSchemaJson}
      )
    ).rejects.toThrow("must have required property");
  });
});
