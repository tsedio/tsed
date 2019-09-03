import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/typeorm"; // import typeorm ts.ed module

@ServerSettings({
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
export class Server extends ServerLoader {

}
