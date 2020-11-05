import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as helmet from "helmet";
import * as methodOverride from "method-override";
import {MyDataSource} from "./graphql/datasources/MyDataSource";
import {RecipeResolver} from "./graphql/recipes/RecipeResolver";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {},
  exclude: [
    "**/*.spec.ts"
  ],
  imports: [
    MyDataSource
  ],
  graphql: {
    default: {
      path: "/",
      resolvers: [RecipeResolver],
      buildSchemaOptions: {}
    }
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(helmet())
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
