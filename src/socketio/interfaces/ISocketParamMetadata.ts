import {Type} from "@tsed/core";
import {SocketFilters} from "./SocketFilters";

/**
 *
 */
export interface ISocketParamMetadata {
  filter: SocketFilters;
  mapIndex?: number;
  useConverter?: boolean;
  type?: Type<any>;
  collectionType?: Type<any>;
}
