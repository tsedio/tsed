import {IMetadataType} from "@tsed/core";
import {SocketFilters} from "./SocketFilters";

/**
 *
 */
export interface ISocketParamMetadata extends IMetadataType {
  filter: SocketFilters;
  mapIndex?: number;
  useConverter?: boolean;
}
