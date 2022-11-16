import {Groups, ReadOnly, Required} from "@tsed/schema";

export interface RevisionFieldsModel {
  created: number;
  modified: number;
}

export class RevisionAdapterModel implements RevisionFieldsModel {
  @Required()
  @ReadOnly()
  @Groups("!create", "!update")
  created: number = Date.now();

  @Required()
  @ReadOnly()
  @Groups("!create", "!update")
  modified: number = Date.now();
}
