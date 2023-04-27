import {PlatformApplication} from "@tsed/common";
import {Inject, Module} from "@tsed/di";
import {PlatformRenderOptions, PlatformViews} from "@tsed/platform-views";
import compress from "compression";

import {ViteRendererMiddleware} from "./middlewares/ViteRendererMiddleware";
import {VITE_SERVER} from "./services/ViteServer";
import {ViteService} from "./services/ViteService";

@Module({
  imports: []
})
export class ViteModule {
  @Inject()
  protected app: PlatformApplication;

  @Inject()
  protected platformView: PlatformViews;

  @Inject()
  protected viteService: ViteService;

  @Inject(VITE_SERVER)
  protected viteServer: VITE_SERVER;

  async $onInit() {
    this.platformView.registerEngine("vite", {
      options: {},
      render: async (path: string, options: PlatformRenderOptions) => {
        return (await this.viteService.render(path, options)) || "";
      }
    });
  }

  $afterInit() {
    this.app.use(compress(), this.viteServer.middlewares);
  }

  $afterRoutesInit() {
    return this.app.get("*", ViteRendererMiddleware);
  }
}
