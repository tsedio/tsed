import * as Express from "express";

/**
 * @ignore
 */
export function staticsMiddleware(directory: string, options: any = {}) {
  const middleware = Express.static(directory, options);

  return (request: any, response: any, next: any) => {
    if (!response.headersSent) {
      middleware(request, response, next);
    } else {
      next();
    }
  };
}
