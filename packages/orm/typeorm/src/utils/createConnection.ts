import {getValue} from "@tsed/core";
import {Connection, ConnectionOptions, getConnectionManager} from "typeorm";

export async function createConnection(connectionOptions: ConnectionOptions): Promise<Connection> {
  const connectionManager = getConnectionManager();

  const name = getValue<string>(connectionOptions, "name", "default");

  if (!connectionManager.has(name)) {
    connectionManager.create({...connectionOptions, name}!);
  }

  const connection = connectionManager.get(name);

  if (!connection.isConnected) {
    await connection.connect();
  }

  return connection;
}
