import {Configuration} from "@tsed/common";
import {resolve} from "path";
import {myContainer} from "./inversify.config";

const rootDir = resolve(__dirname);

@Configuration({
  rootDir,
  resolvers: [
    {
      get(token: any) {
        return myContainer.get(token);
      }
    }
  ]
})
export class Server {
}
