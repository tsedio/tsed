import {ClientOptions, ConnectionOptions} from "@temporalio/client";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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
