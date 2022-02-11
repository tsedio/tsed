import {Module} from "@tsed/di";
import {myContainer} from "./inversify.config";

@Module({
  resolvers: [
    {
      get(token: any) {
        return myContainer.get(token);
      }
    }
  ]
})
export class MyModule {}
