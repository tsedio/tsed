import {QueryParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Enum} from "@tsed/schema";

export enum SearchType {
  PARTIAL = "partial",
  EXTENDED = "extended"
}

@Controller("/enums")
export class AnyCtrl {
  // BREAKING CHANGE with v5
  @Post()
  updatePayload1(@QueryParams("type") type = SearchType.PARTIAL): any {
    // type = SearchType.PARTIAL will considered by typescript as any => Object
  }

  // WORKS
  @Post()
  updatePayload2(@QueryParams("type") type: SearchType = SearchType.PARTIAL): any {}

  // Add validation
  @Post()
  updatePayload3(@QueryParams("type") @Enum(SearchType) type: SearchType = SearchType.PARTIAL): any {}
}
