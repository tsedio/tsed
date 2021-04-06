import {ConnectionOptions, getConnectionManager} from "typeorm";

export async function createConnection(connectionOptions: ConnectionOptions) {
  const connectionManager = getConnectionManager();
  const name = connectionOptions.name ?? "default";

  if (!connectionManager.has(name)) {
    const connection = connectionManager.create(connectionOptions!);
    await connection.connect();
  }

  const connection = connectionManager.get(name);

  // Add hook to close connection when server is killed
  // @ts-ignore
  connection.$onDestroy = connection.$onDestroy || (() => connection.isConnected && connection.close());

  return connection;
}
