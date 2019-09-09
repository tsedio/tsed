import {ServerLoader, ServerSettings} from "@tsed/common";
import "./connections/CONNECTION";

@ServerSettings({
  customConnection: {
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
  }
})
export class Server extends ServerLoader {

}
