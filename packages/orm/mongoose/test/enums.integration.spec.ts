import {CollectionOf, Default, Description, Enum, enums, getJsonSchema, MaxLength, MinLength, Required} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {Model} from "../src/index.js";

export enum ComponentStatuses {
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  DEGRADED_PERFORMANCE = "DEGRADED_PERFORMANCE",
  PARTIAL_OUTAGE = "PARTIAL_OUTAGE",
  MAJOR_OUTAGE = "MAJOR_OUTAGE"
}

enums(ComponentStatuses).label("ComponentStatuses");

export class ResponseTimeThreshold {
  @Enum(ComponentStatuses)
  @Required()
  @Default(ComponentStatuses.MAJOR_OUTAGE)
  status: ComponentStatuses = ComponentStatuses.MAJOR_OUTAGE;
}

@Model({
  name: "components-statuses-settings"
})
export class ComponentStatusSettings {
  @Required()
  @Description("The settings name")
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @CollectionOf(ResponseTimeThreshold)
  responseTimes: ResponseTimeThreshold[];
}

describe("Enums integration", () => {
  beforeEach(() => TestContainersMongo.create());
  afterEach(() => TestContainersMongo.reset());

  it("should not fail when the enum is used with enums() utils", () => {
    expect(getJsonSchema(ComponentStatusSettings)).toEqual({
      definitions: {
        ComponentStatuses: {
          enum: ["UNDER_MAINTENANCE", "DEGRADED_PERFORMANCE", "PARTIAL_OUTAGE", "MAJOR_OUTAGE"],
          type: "string"
        },
        ResponseTimeThreshold: {
          properties: {
            status: {
              $ref: "#/definitions/ComponentStatuses"
            }
          },
          required: ["status"],
          type: "object"
        }
      },
      properties: {
        name: {
          description: "The settings name",
          maxLength: 100,
          minLength: 3,
          type: "string"
        },
        responseTimes: {
          items: {
            $ref: "#/definitions/ResponseTimeThreshold"
          },
          type: "array"
        }
      },
      required: ["name"],
      type: "object"
    });
  });
});
