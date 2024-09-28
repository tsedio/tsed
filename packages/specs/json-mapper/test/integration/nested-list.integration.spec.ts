import {CollectionOf, ForwardGroups, Name, Required} from "@tsed/schema";

import {serialize} from "../../src/utils/serialize.js";

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

describe("Nested list serialization", () => {
  it("should generated schema with alias", () => {
    const data = new TeamsModel();
    const team = new TeamModel();
    team.name = "name";
    data.teams = [team];

    expect(serialize(data, {useAlias: true})).toEqual({
      teams: [
        {
          teamName: "name"
        }
      ]
    });
  });
  it("should generated schema with alias and plain object js", () => {
    const data = new TeamsModel();
    const team: any = {};
    team.name = "name";
    data.teams = [team];

    expect(serialize(data, {useAlias: true})).toEqual({
      teams: [
        {
          teamName: "name"
        }
      ]
    });
  });
});
