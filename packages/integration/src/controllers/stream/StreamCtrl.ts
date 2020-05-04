import {Controller, Get, Res} from "@tsed/common";
import Axios from "axios";

@Controller("/stream")
export class StreamCtrl {
  @Get("/")
  async get() {
    return Axios.get("https://cerevoice.s3.amazonaws.com/Heather800010cbc6611f5540bd0809a388dc95a615b.wav", {
      responseType: "stream"
    });
  }
}
