import {expect} from "chai";
import {CollectionOf, ForwardGroups, Name, Required} from "@tsed/schema";
import {serialize} from "@tsed/json-mapper";

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
    data.teams = [
      team
    ];

    expect(serialize(data, { useAlias: true })).to.deep.eq({
      "teams": [
        {
          "teamName": "name"
        }
      ]
    });
  });
});
