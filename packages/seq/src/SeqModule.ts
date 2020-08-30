import {AfterRoutesInit, Inject, InjectorService} from "@tsed/common";
import {Constant, Module} from "@tsed/di";
import {ISeqSettings} from "./interfaces/ISeqSettings";

@Module({})
export class SeqModule implements AfterRoutesInit {
  @Constant("seq", {
    url: "http://localhost:5341",
  })
  private config: ISeqSettings;

  @Inject()
  private injector: InjectorService;

  $afterRoutesInit() {
    if (this.injector.logger && this.injector.logger.appenders) {
      this.injector.logger.appenders.set("seq", {
        type: "seq",
        levels: ["info", "debug", "trace", "fatal", "error", "warn"],
        url: this.config.url,
        apiKey: this.config.apiKey,
      });
    }
  }
}
