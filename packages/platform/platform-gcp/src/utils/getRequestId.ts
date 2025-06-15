import {v4} from "uuid";

import type {GCPEvent} from "../domain/GCPEvent.js";
import {isBackgroundEvent, isHttpEvent} from "../domain/GCPEvent.js";

/**
 * Get the request ID from the event or context, or generate a new one if not available.
 * @param event The GCP event
 * @returns The request ID
 */
export function getRequestId(event: GCPEvent): string {
  if (isHttpEvent(event)) {
    // For HTTP events, try to get the request ID from the headers
    const requestId = event.req.headers["x-request-id"] || event.req.headers["x-correlation-id"];

    if (requestId) {
      return Array.isArray(requestId) ? requestId[0] : requestId;
    }
  } else if (isBackgroundEvent(event)) {
    // For background events, use the event ID if it exists
    if (event.context.eventId !== undefined) {
      return event.context.eventId;
    }
  }

  // Generate a new UUID if no request ID is available
  return v4();
}
