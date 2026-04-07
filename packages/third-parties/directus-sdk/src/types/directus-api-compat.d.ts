declare module "@directus/api/cache" {
  export function getCache(): any;
  export function getCacheValue(cache: any, key: string): Promise<any>;
  export function setCacheValue(cache: any, key: string, value: any, ttl?: number): Promise<void>;
}

declare module "@directus/api" {
  export function getCache(): any;
  export function getCacheValue(cache: any, key: string): Promise<any>;
  export function setCacheValue(cache: any, key: string, value: any, ttl?: number): Promise<void>;
}

declare module "@directus/api/logger/index" {
  export function useLogger(): {
    info: (message: unknown) => void;
    warn: (message: unknown) => void;
    debug: (message: unknown) => void;
    trace: (message: unknown) => void;
    error: (message: unknown) => void;
  };
}
