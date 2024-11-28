import "@tsed/platform-express";
import "@tsed/graphql-ws";

import {ApolloService} from "@tsed/apollo";
import {runInContext} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {gql} from "graphql-tag";

import {Server} from "./app/Server.js";

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      title
      description
      creationDate
    }
  }
`;

const ADD_RECIPE = gql`
  mutation AddRecipe($title: String!, $description: String!) {
    addRecipe(title: $title, description: $description) {
      title
      description
      creationDate
    }
  }
`;

describe("TypeGraphQL", () => {
  beforeAll(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress
    })
  );
  afterAll(PlatformTest.reset);

  it("should get recipes", async () => {
    const $ctx = PlatformTest.createRequestContext();
    const server = PlatformTest.get<ApolloService>(ApolloService);

    const response = await runInContext($ctx, () => {
      return server.get()!.executeOperation({
        query: GET_RECIPES,
        variables: {}
      });
    });

    expect($ctx.get("test")).toEqual("test");
    expect(response.body).toEqual({
      kind: "single",
      singleResult: {
        data: {
          recipes: [
            {
              creationDate: expect.any(String),
              description: "Description",
              title: "title"
            }
          ]
        }
      }
    });
  });

  it("should add recipe", async () => {
    const $ctx = PlatformTest.createRequestContext();
    const server = PlatformTest.get<ApolloService>(ApolloService);

    const response = await runInContext($ctx, () => {
      return server.get()!.executeOperation({
        query: ADD_RECIPE,
        variables: {
          title: "title",
          description: "description"
        }
      });
    });

    expect(response.body).toEqual({
      kind: "single",
      singleResult: {
        data: {
          addRecipe: {
            creationDate: expect.any(String),
            description: "description",
            title: "title"
          }
        }
      }
    });
  });
});
