import {PlatformApplication} from "@tsed/common";
import {Inject, Module} from "@tsed/di";
import {PlatformRenderOptions, PlatformViews} from "@tsed/platform-views";
import compress from "compression";

import {VikeRendererMiddleware} from "./middlewares/VikeRendererMiddleware";
import {VIKE_SERVER} from "./services/VikeServer";
import {VikeService} from "./services/VikeService";

@Module({
  imports: []
})
export class VikeModule {
  @Inject()
  protected app: PlatformApplication;

  @Inject()
  protected platformView: PlatformViews;

  @Inject()
  protected vikeService: VikeService;

  @Inject(VIKE_SERVER)
  protected vikeServer: VIKE_SERVER;

  $onInit() {
    this.platformView.registerEngine("vike", {
      options: {},
      render: async (path: string, options: PlatformRenderOptions) => {
        return (await this.vikeService.render(path, options)) || "";
      }
    });
  }

  $afterInit() {
    this.app.use(compress(), this.vikeServer.middlewares);
  }

  $afterRoutesInit() {
    return this.app.get("*", VikeRendererMiddleware);
  }
}
