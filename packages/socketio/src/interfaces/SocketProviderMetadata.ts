import {SocketHandlerMetadata} from "./SocketHandlerMetadata";

/**
 *
 */
export enum SocketProviderTypes {
  SERVICE = "service",
  MIDDLEWARE = "middleware"
}

/**
 *
 */
export interface SocketProviderMetadata {
  type: SocketProviderTypes;
  error?: boolean;
  namespace?: string;
  injectNamespaces?: {propertyKey: string; nsp: string}[];
  useBefore?: any[];
  useAfter?: any[];
  handlers: {
    [propertyKey: string]: SocketHandlerMetadata;
  };
}
