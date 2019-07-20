import {ServerLoader, ServerSettings} from "@tsed/common";

@ServerSettings({
  componentsScan: [
    "${rootDir}/graphql/**/*.ts" // add this pattern to scan resolvers or datasources
  ],
  graphql: {
    "server1": {
      // GraphQL server configuration
    }
  }
})
export class Server extends ServerLoader {

}
