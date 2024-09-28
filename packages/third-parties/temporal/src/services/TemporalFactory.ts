import {Client, Connection} from "@temporalio/client";
import {Logger} from "@tsed/common";
import {Configuration, registerProvider} from "@tsed/di";

export const TemporalConnection = Connection;
export type TemporalConnection = Connection;

export const TemporalClient = Client;
export type TemporalClient = Client;

registerProvider({
  provide: TemporalConnection,
  deps: [Configuration, Logger],
  async useAsyncFactory(settings: Configuration, logger: Logger) {
    const {temporal} = settings;
    if (!temporal?.enabled) {
      return null;
    }

    try {
      logger.info("Connecting to Temporal Server: ", temporal.connection?.address || "default");
      const connection = await Connection.connect(temporal.connection);
      logger.info("... connected to Temporal Server: ", temporal.connection?.address || "default");
      return connection;
    } catch (error) {
      logger.error("Failed to connect to Temporal Server:", error);
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
  },
  hooks: {
    $onDestroy: async (client: Client | null) => {
      if (client) {
        await client.connection.close();
      }
    }
  }
});
