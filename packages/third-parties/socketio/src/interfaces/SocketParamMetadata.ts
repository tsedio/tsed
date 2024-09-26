import type {MetadataTypes} from "@tsed/core";

import type {SocketFilters} from "./SocketFilters.js";

export interface SocketParamMetadata extends Partial<MetadataTypes> {
  filter: SocketFilters;
  mapIndex?: number;
  useMapper?: boolean;
}
