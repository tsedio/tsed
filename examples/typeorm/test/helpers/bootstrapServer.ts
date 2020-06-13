import {PlatformTest} from "@tsed/common";
import {rootDir, Server} from "../../src/Server";

export function bootstrapServer(options: any) {
  return PlatformTest.bootstrap(Server, {
    ...options,

    typeorm: [{
      name: "default",
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
      logging: false,
      entities: [
        `${rootDir}/entities/*{.ts,.js}`
      ],
      migrations: [
        `${rootDir}/migrations/*{.ts,.js}`
      ],
      subscribers: [
        `${rootDir}/subscriber/*{.ts,.js}`
      ]
    }]
  });
}
