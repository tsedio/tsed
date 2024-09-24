import {ClientOptions, ConnectionOptions} from "@temporalio/client";

declare global {
  namespace TsED {
    interface Configuration {
      temporal?: {
        enabled?: boolean;
        connection?: ConnectionOptions;
        client?: Omit<ClientOptions, "connection">;
      };
    }
  }
}
