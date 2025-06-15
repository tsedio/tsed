import type {Request, Response} from "express";

export interface GcpPubSubEvent {
  data?: string; // Base64-encoded string
  attributes?: {[key: string]: string};
  messageId?: string;
  publishTime?: string;
}

export interface GCPCloudStorageEvent {
  bucket: string;
  name: string;
  metageneration: string;
  timeCreated: string;
  updated: string;

  [key: string]: any; // Permet d'ajouter d'autres propriétés dynamiques
}

export interface GCPFirestoreValue {
  createTime?: string;
  fields?: {[field: string]: any};
  name?: string;
  updateTime?: string;
}

export interface GPCFirestoreEvent {
  oldValue?: GCPFirestoreValue;
  value?: GCPFirestoreValue;
  updateMask?: {fieldPaths?: string[]};
}

/**
 * Type definition for Google Cloud Functions HTTP event
 */
export interface GCPHttpEvent {
  req: Request;
  res: Response;
}

export interface GCPAuthEvent {
  metadata: {
    createdAt: string;
    lastSignedInAt: string;
    [key: string]: any;
  };
  uid: string;
  email?: string;
  emailVerified: boolean;
  disabled: boolean;

  [key: string]: any;
}

export interface RawGCPContext {
  eventId: string;
  timestamp: string;
  eventType: string;
  resource:
    | {
        service: string;
        name: string;
        type: string;
      }
    | string;
}

/**
 * Type definition for Google Cloud Functions background event
 */
export type GCPBackgroundEvent = GcpPubSubEvent | GCPCloudStorageEvent | GPCFirestoreEvent | GCPAuthEvent | any;
export type RawGPCRequest = Request;
export type RawGPCResponse = Response;
export type GCPBackgroundEventHandler = (event: GCPBackgroundEvent, context: RawGCPContext) => Promise<any> | any;
export type GCPHttpEventHandler = (req: RawGPCRequest, res: RawGPCResponse) => void;
export type GCPRequestHandler = GCPBackgroundEventHandler | GCPHttpEventHandler;
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
