import {ServerLoader, ServerSettings} from "@tsed/common";
import {resolve}  from "path";
const rootDir = resolve(__dirname);
import { myContainer } from "./inversify.config";

@ServerSettings({
  rootDir,
  resolvers: [
    {
      get(token: any) {
        return myContainer.get(token)
      }
    }
  ]
})
export class Server {
}
