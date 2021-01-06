export function rawBodyMiddleware(request: any, response: any, next: any) {
  request.rawBody = "";
  request.on("data", (chunk: string) => {
    request.rawBody += chunk;
  });
  next();
}
