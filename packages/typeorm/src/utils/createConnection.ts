import {ConnectionOptions, getConnectionManager} from "typeorm";

const connections = new Map();

/**
 * @ignore
 */
export async function createConnection(connectionOptions: ConnectionOptions) {
  const connectionManager = getConnectionManager();
  const name = connectionOptions.name!;

  if (!connections.has(name)) {
    const connection = connectionManager.create(connectionOptions!);
    connections.set(name, connection.connect());
  }

  await connections.get(name);

  const connection = connectionManager.get(name);

  // Add hook to close connection when server is killed
  // @ts-ignore
  connection.$onDestroy = connection.$onDestroy || (() => connection.isConnected && connection.close());

  return connection;
}
