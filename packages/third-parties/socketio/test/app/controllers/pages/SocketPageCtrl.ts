import {Controller} from "@tsed/di";
import {Get, Hidden, Returns, View} from "@tsed/schema";
import fs from "fs";

@Controller("/")
@Hidden()
export class SocketPageCtrl {
  @Get("/socket")
  @View("socket")
  public socket() {
    return {socketScript: "/socket/socket.io.js"};
  }

  @Get("/socket/socket.io.js")
  @(Returns(200).ContentType("application/javascript"))
  public getScript() {
    return fs.readFileSync(require.resolve("socket.io-client/dist/socket.io.js"), {encoding: "utf8"});
  }
}
