import {PlatformTest} from "@tsed/common";
import "@tsed/platform-express";
import {ApolloServerTestClient, createTestClient} from "apollo-server-testing";
import {expect} from "chai";
import gql from "graphql-tag";
import {GraphQLService} from "@tsed/graphql";
import {Server} from "./app/Server";

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      title
      description
      creationDate
    }
  }
`;

describe("Recipes", () => {
  let request: ApolloServerTestClient;
  before(PlatformTest.bootstrap(Server));
  before(() => {
    const server = PlatformTest.get<GraphQLService>(GraphQLService).get("server1")!;
    request = createTestClient(server);
  });
  after(PlatformTest.reset);

  it("should get recipes", async () => {
    const response = await request.query({
      query: GET_RECIPES,
      variables: {}
    });

    expect(response.data).to.deep.eq({
      "recipes": [
        {
          "creationDate": "2020-08-20T00:00:00.000Z",
          "description": "Description",
          "title": "title"
        }
      ]
    });
  });
});
