// https://vitepress.dev/guide/custom-theme
import {DefaultTheme, DocActions} from "@tsed/vitepress-theme";
import HomeBanner from "@tsed/vitepress-theme/organisms/home/HomeBanner.vue";
import HomeBody from "@tsed/vitepress-theme/organisms/home/HomeBody.vue";
import HomeTabsTerminal from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabsTerminal.vue";
import HomeTabTerminalBun from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalBun.vue";
import HomeTabTerminalNpm from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalNpm.vue";
import HomeTabTerminalPnpm from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalPnpm.vue";
import HomeTabTerminalYarn from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalYarn.vue";
import HomeBeforeFeatures from "@tsed/vitepress-theme/organisms/home/HomeBeforeFeatures.vue";
import type {Theme} from "vitepress";
import {h} from "vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "doc-before": () => h(
        DocActions
      ),
      "home-hero-image": () =>
        h(HomeBanner, null, {
          default: () =>
            h(HomeTabsTerminal, null, {
              npm: () => h(HomeTabTerminalNpm),
              yarn: () => h(HomeTabTerminalYarn),
              pnpm: () => h(HomeTabTerminalPnpm),
              bun: () => h(HomeTabTerminalBun)
            })
        }),
      "home-features-before": () => h(HomeBeforeFeatures),
      "home-features-after": () => h(HomeBody)
    });
  }
} satisfies Theme;
