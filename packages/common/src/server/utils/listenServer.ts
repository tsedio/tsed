import * as Http from "http";
import * as Https from "https";

export function listenServer(http: Http.Server | Https.Server, settings: {https: boolean; address: string | number; port: number}): Promise<{address: string; port: number, https: boolean}> {
  const {address, port, https} = settings;

  const promise = new Promise((resolve, reject) => {
    http.on("listening", resolve).on("error", reject);
  }).then(() => {
    const port = (http.address() as any).port;

    return {address: settings.address as string, port, https};
  });

  http.listen(port, address as any);

  return promise;
}
