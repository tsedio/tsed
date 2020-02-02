import {Type} from "./Type";

export interface IMetadataType {
  type?: Type<any> | any;
  collectionType?: Type<any> | any;
}
