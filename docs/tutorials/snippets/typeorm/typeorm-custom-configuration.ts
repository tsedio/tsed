import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "./connections/CONNECTION";

@Configuration({
  customConnection: {
    name: "default",
    type: "postgres",
    // ...,

    entities: [`${__dirname}/entity/*{.ts,.js}`],
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    subscribers: [`${__dirname}/subscriber/*{.ts,.js}`]
  }
})
export class Server {}
