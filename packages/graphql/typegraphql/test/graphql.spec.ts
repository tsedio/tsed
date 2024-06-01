import {PlatformTest, runInContext} from "@tsed/common";
import "@tsed/platform-express";
import {PlatformExpress} from "@tsed/platform-express";
import {ApolloServerTestClient, createTestClient} from "apollo-server-testing";
import gql from "graphql-tag";
import "@tsed/graphql-ws";
import {TypeGraphQLService} from "../src/index.js";
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

describe("GraphQL", () => {
  let request: ApolloServerTestClient;
  beforeAll(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress
    })
  );
  beforeAll(() => {
    const server = PlatformTest.get<TypeGraphQLService>(TypeGraphQLService).get("default")!;
    request = createTestClient(server as any);
  });
  afterAll(PlatformTest.reset);

  it("should get recipes", async () => {
    const $ctx = PlatformTest.createRequestContext();

    const response = await runInContext($ctx, () => {
      return request.query({
        query: GET_RECIPES,
        variables: {}
      });
    });

    expect($ctx.get("test")).toEqual("test");
    expect(response.data).toEqual({
      recipes: [
        {
          creationDate: "2020-08-20T00:00:00.000Z",
          description: "Description",
          title: "title"
        }
      ]
    });
  });

  it("should add recipe", async () => {
    const $ctx = PlatformTest.createRequestContext();

    const response = await runInContext($ctx, () => {
      return request.query({
        query: ADD_RECIPE,
        variables: {
          title: "title",
          description: "description"
        }
      });
    });

    expect(response.data).toEqual({
      addRecipe: {
        creationDate: expect.any(String),
        description: "description",
        title: "title"
      }
    });
  });
});
