import {MetadataTypes} from "@tsed/core";
import {SocketFilters} from "./SocketFilters";

export interface ISocketParamMetadata extends Partial<MetadataTypes> {
  filter: SocketFilters;
  mapIndex?: number;
  useConverter?: boolean;
}
