import {Inject, Module} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import {PlatformRenderOptions, PlatformViews} from "@tsed/platform-views";
import compress from "compression";

import {ViteRendererMiddleware} from "./middlewares/ViteRendererMiddleware.js";
import {VITE_SERVER} from "./services/ViteServer.js";
import {ViteService} from "./services/ViteService.js";

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

  $onInit() {
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
