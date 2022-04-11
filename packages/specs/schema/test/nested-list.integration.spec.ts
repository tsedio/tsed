import {CollectionOf, ForwardGroups, getJsonSchema, Name, Required} from "../src";

class TeamModel {
  @Required()
  @Name("teamName")
  name: string;
}

class TeamsModel {
  @Required()
  @CollectionOf(TeamModel)
  @ForwardGroups()
  teams: TeamModel[];
}

describe("Nested list schema", () => {
  it("should generated schema with alias", () => {
    expect(getJsonSchema(TeamsModel, {useAlias: true})).toEqual({
      definitions: {
        TeamModel: {
          properties: {
            teamName: {
              minLength: 1,
              type: "string"
            }
          },
          required: ["teamName"],
          type: "object"
        }
      },
      properties: {
        teams: {
          items: {
            $ref: "#/definitions/TeamModel"
          },
          type: "array"
        }
      },
      required: ["teams"],
      type: "object"
    });
  });
});
