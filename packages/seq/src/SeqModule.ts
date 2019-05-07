import {Inject, Service} from "@tsed/di";
import {$log} from "ts-log-debug";
import {AfterRoutesInit, ServerSettingsService} from "@tsed/common";
import {ISeqSettings} from "./interfaces/ISeqSettings";

@Service()
export class SeqModule implements AfterRoutesInit {
  private config: ISeqSettings;

  constructor(@Inject() private serverSettingsService: ServerSettingsService) {
    this.config = serverSettingsService.get("seq") || {};
  }

  $afterRoutesInit() {
    $log.appenders.set("seq", {
      type: "seq",
      levels: ["info", "debug", "trace", "fatal", "error", "warn"],
      url: this.config.url ? this.config.url : "http://localhost:5341"
    });
  }
}
