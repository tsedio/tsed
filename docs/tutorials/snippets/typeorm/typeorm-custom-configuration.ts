import "@tsed/platform-express";
import "./connections/CONNECTION";

import {Configuration} from "@tsed/di";

@Configuration({
  customConnection: {
    name: "default",
    type: "postgres",
    // ...,

    entities: [`./entity/*{.ts,.js}`],
    migrations: [`./migrations/*{.ts,.js}`],
    subscribers: [`./subscriber/*{.ts,.js}`]
  }
})
export class Server {}
