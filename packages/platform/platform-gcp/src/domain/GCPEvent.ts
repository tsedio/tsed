import type {Request, Response} from "express";

/**
 * Type definition for Google Cloud Functions HTTP event
 */
export interface GCPHttpEvent {
  req: Request;
  res: Response;
}

/**
 * Type definition for Google Cloud Functions background event
 */
export interface GCPBackgroundEvent {
  data: any;
  context: {
    eventId: string;
    timestamp: string;
    eventType: string;
    resource: {
      service: string;
      name: string;
    };
  };
}

/**
 * Union type for all Google Cloud Functions event types
 */
export type GCPEvent = GCPHttpEvent | GCPBackgroundEvent;

/**
 * Type guard to check if an event is an HTTP event
 */
export function isHttpEvent(event: GCPEvent): event is GCPHttpEvent {
  return "req" in event && "res" in event;
}

/**
 * Type guard to check if an event is a background event
 */
export function isBackgroundEvent(event: GCPEvent): event is GCPBackgroundEvent {
  return "data" in event && "context" in event;
}
