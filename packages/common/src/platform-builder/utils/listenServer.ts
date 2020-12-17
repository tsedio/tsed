import Http from "http";
import Https from "https";

export function listenServer(
  http: Http.Server | Https.Server,
  settings: {address: string | number; port: number}
): Promise<{address: string; port: number}> {
  const {address, port} = settings;

  const promise = new Promise((resolve, reject) => {
    http.on("listening", resolve);
    http.on("error", reject);
  }).then(() => {
    const port = (http.address() as any).port;

    return {address: settings.address as string, port};
  });

  http.listen(port, address as any);

  return promise;
}
