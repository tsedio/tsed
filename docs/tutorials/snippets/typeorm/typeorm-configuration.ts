import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/typeorm"; // !!! IMPORTANT TO ADD THIS !!!

@Configuration({
  typeorm: [
    {
      name: "default",
      type: "postgres",
      // ...,

      entities: [`${__dirname}/entity/*{.ts,.js}`],
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      subscribers: [`${__dirname}/subscriber/*{.ts,.js}`]
    },
    {
      name: "mongo",
      type: "mongodb"
      // ...
    }
  ]
})
export class Server {}
