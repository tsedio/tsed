export const TEMPORAL_STORE_KEY = "temporal";

export interface ActivityOptions {
  name?: string;
}

export interface TemporalStore {
  activities?: {[propertyKey: string]: ActivityOptions};
}
