import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "./connections/CONNECTION";

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
