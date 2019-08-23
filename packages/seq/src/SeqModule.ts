import {Configuration, Constant, Service} from "@tsed/di";
import {$log} from "ts-log-debug";
import {AfterRoutesInit} from "@tsed/common";
import {ISeqSettings} from "./interfaces/ISeqSettings";

@Configuration()
export class SeqModule implements AfterRoutesInit {
  @Constant("seq", {
    url: "http://localhost:5341"
  })
  private config: ISeqSettings;

  $afterRoutesInit() {
    $log.appenders.set("seq", {
      type: "seq",
      levels: ["info", "debug", "trace", "fatal", "error", "warn"],
      url: this.config.url
    });
  }
}
