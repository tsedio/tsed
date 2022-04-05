import "@tsed/ajv";
import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/typegraphql";
import "@tsed/passport";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import {buildContext} from "graphql-passport";
import methodOverride from "method-override";
import {resolve} from "path";
import {User} from "./graphql/auth/User";

const rootDir = resolve(__dirname);

@Configuration({
  rootDir,
  port: 8001,
  httpsPort: false,
  logger: {
    level: "info",
    logRequest: true
  },
  mount: {},
  disableComponentScan: false,
  componentsScan: ["${rootDir}/services/**/*.ts", "${rootDir}/graphql/**/*.ts", "${rootDir}/protocols/**/*.ts"],
  graphql: {
    default: {
      path: "/api/graphql",
      buildSchemaOptions: {
        emitSchemaFile: resolve(__dirname, "../resources/schema.gql")
      },
      serverConfig: {
        context({req, res}: any) {
          return buildContext({req, res, User});
        }
      },
      middlewareOptions: {
        cors: true
      }
    }
  },
  passport: {
    userInfoModel: User
  }
})
export class Server {}
