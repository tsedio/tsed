// https://vitepress.dev/guide/custom-theme
import {DefaultTheme} from "@tsed/vitepress-theme";
import type {Theme} from "vitepress";
import {h} from "vue";
import HomeBanner from "@tsed/vitepress-theme/organisms/home/HomeBanner.vue";
import HomePartners from "@tsed/vitepress-theme/organisms/home/HomePartners.vue";
import HomeBody from "@tsed/vitepress-theme/organisms/home/HomeBody.vue";
import HomeTabsTerminal from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabsTerminal.vue";
import HomeTabTerminalNpm from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalNpm.vue";
import HomeTabTerminalYarn from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalYarn.vue";
import HomeTabTerminalPnpm from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalPnpm.vue";
import HomeTabTerminalBun from "@tsed/vitepress-theme/organisms/home/terminal/HomeTabTerminalBun.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
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
      "home-features-before": () => h(HomePartners),
      "home-features-after": () => h(HomeBody)
    });
  }
} satisfies Theme;
