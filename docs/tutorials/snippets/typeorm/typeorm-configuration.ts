import {Configuration} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/typeorm"; // import typeorm ts.ed module

@Configuration({
  typeorm: [
    {
      name: "default",
      type: "postgres",
      // ...,

      entities: [
        `${__dirname}/entity/*{.ts,.js}`
      ],
      migrations: [
        `${__dirname}/migrations/*{.ts,.js}`
      ],
      subscribers: [
        `${__dirname}/subscriber/*{.ts,.js}`
      ]
    },
    {
      name: "mongo",
      type: "mongodb"
      // ...
    }
  ]
})
export class Server {

}
