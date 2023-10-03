import {Configuration, registerProvider} from "@tsed/di";
import {Client, Connection} from "@temporalio/client";
import {$log} from "@tsed/common";

export const TemporalConnection = Connection;
export type TemporalConnection = Connection;

export const TemporalClient = Client;
export type TemporalClient = Client;

registerProvider({
  provide: TemporalConnection,
  deps: [Configuration],
  async useAsyncFactory(settings: Configuration) {
    const {temporal} = settings;
    if (!temporal?.enabled) {
      return null;
    }

    try {
      $log.info("Connecting to Temporal Server: ", temporal.connection?.address || "default");
      const connection = await Connection.connect(temporal.connection);
      $log.info("... connected to Temporal Server: ", temporal.connection?.address || "default");
      return connection;
    } catch (error) {
      $log.error("Failed to connect to Temporal Server:", error);
      throw error;
    }
  }
});

registerProvider({
  provide: TemporalClient,
  deps: [Configuration, TemporalConnection],
  useFactory(settings: Configuration, connection: TemporalConnection) {
    const {temporal} = settings;
    if (!temporal?.enabled) {
      return null;
    }

    const client = new TemporalClient({
      connection,
      ...temporal.client
    });

    return client;
  }
});
