import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Any} from "@tsed/schema";

@Controller("/any")
export class AnyCtrl {
  @Post()
  updatePayload1(@BodyParams() payload: any): any {
    // accept only Object
    // breaking change with v5
    console.log("payload", payload);

    return payload;
  }

  @Post()
  updatePayload2(@BodyParams() @Any() payload: any): any {
    // accept all types
    console.log("payload", payload);

    return payload;
  }

  @Post()
  updatePayload3(@BodyParams() payload: any[]): any {
    // accept array of any types
    console.log("payload", payload);

    return payload;
  }
}
