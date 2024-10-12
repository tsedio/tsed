import {Res} from "@tsed/platform-http";
import {QueryParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import Axios from "axios";
import {IncomingMessage} from "http";

@Controller("/proxy")
export class ProxyCtrl {
  @Get("/")
  proxy(@QueryParams("path") path: string) {
    return Axios.get(`https://cerevoice.s3.amazonaws.com/${path}`, {
      responseType: "stream"
    });
  }

  // is equivalent to doing that
  @Get("/")
  async proxy2(@Res() res: Res, @QueryParams("path") path: string): IncomingMessage {
    const response = await Axios.get(`https://cerevoice.s3.amazonaws.com/${path}`, {
      responseType: "stream"
    });

    res.set(response.headers);
    res.status(response.status);

    return response.data;
  }
}
