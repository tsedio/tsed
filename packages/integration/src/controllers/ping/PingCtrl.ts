import {Controller, Get} from "@tsed/common";

@Controller("/ping")
export class PingCtrl {
  @Get("/")
  async pong(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve("pong-v1.1");
      }, 5000);
    });
  }
}
