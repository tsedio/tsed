import {MetadataTypes} from "@tsed/core";
import {SocketFilters} from "./SocketFilters";

export interface SocketParamMetadata extends Partial<MetadataTypes> {
  filter: SocketFilters;
  mapIndex?: number;
  useMapper?: boolean;
}
