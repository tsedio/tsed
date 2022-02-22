import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/typeorm"; // !!! IMPORTANT TO ADD THIS !!!

@Configuration({
  typeorm: [
    {
      name: "default",
      type: "postgres",
      // ...,

      entities: [`./entity/*{.ts,.js}`],
      migrations: [`./migrations/*{.ts,.js}`],
      subscribers: [`./subscriber/*{.ts,.js}`]
    },
    {
      name: "mongo",
      type: "mongodb"
      // ...
    }
  ]
})
export class Server {}
