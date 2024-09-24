import {Configuration} from "@tsed/di";

import * as v0Controllers from "./controllers/v0/index";
import * as v1Controllers from "./controllers/v1/index";

@Configuration({
  mount: {
    "/rest/v1": [...Object.values(v1Controllers)],
    "/rest/v0": [...Object.values(v0Controllers)]
  }
})
export class Server {}

// v1/index.ts
export * from "./groups/GroupsControllers";
export * from "./users/UserControllers";

// v0/index.ts
export * from "./groups/GroupsControllers";
export * from "./users/UserControllers";
