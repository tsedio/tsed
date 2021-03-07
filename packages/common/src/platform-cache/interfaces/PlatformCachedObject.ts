export interface PlatformCachedObject {
  ttl: number;
  args: any[];
  data: any;
  expires: number;
  headers: Record<string, number | string | string[]>;
}
