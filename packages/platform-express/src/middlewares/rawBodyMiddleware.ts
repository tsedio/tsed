export function rawBodyMiddleware(request: any, response: any, next: any) {
  if (!request.is("multipart/form-data")) {
    request.rawBody = "";
    request.on("data", (chunk: string) => {
      request.rawBody += chunk;
    });
  }

  next();
}
