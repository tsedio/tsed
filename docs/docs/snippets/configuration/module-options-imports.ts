import {Module} from "@tsed/di";
import {MyController} from "./controllers/MyController";
import {MyService} from "./services/MyService";

@Module({
  mount: {
    "/rest/module1": [MyController]
  },
  imports: [MyService]
})
export class MyModule {}
