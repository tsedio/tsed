import {Configuration} from "@tsed/common";
import "@tsed/platform-express";

@Configuration({
  componentsScan: [
    "${rootDir}/graphql/**/*.ts" // add this pattern to scan resolvers or datasources
  ],
  graphql: {
    "server1": {
      // GraphQL server configuration
    }
  }
})
export class Server {
}
