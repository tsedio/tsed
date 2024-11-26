import {constant, injectable} from "@tsed/di";
import {createConnection} from "@tsed/typeorm";
import {Connection, ConnectionOptions} from "typeorm";

const CONNECTION_NAME = "default"; // change the name according to your server configuration

export type CONNECTION = Connection; // Set alias types (optional)

export const CONNECTION = injectable(Symbol.for("CONNECTION"))
  .asyncFactory(async () => {
    const settings = constant<ConnectionOptions[]>("typeorm")!;
    const connectionOptions = settings.find((o) => o.name === CONNECTION_NAME);

    return createConnection(connectionOptions!);
  })
  .token();
