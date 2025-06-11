import {GCPContext} from "../domain/GCPContext.js";

/**
 * Set common response headers for a GCP response.
 * @param $ctx The GCP context
 */
export function setResponseHeaders($ctx: GCPContext): void {
  // Set the request ID header
  $ctx.response.set("x-request-id", $ctx.id);

  // Set CORS headers if needed
  if ($ctx.request.get("origin")) {
    $ctx.response.set("Access-Control-Allow-Origin", $ctx.request.get("origin") as string);
    $ctx.response.set("Access-Control-Allow-Credentials", "true");
    $ctx.response.set("Vary", "Origin");
  }
}
