import "./window-boot.js";
import "./styles/style.css";
import "prismjs/components/prism-groovy";

import VueTsED from "vuepress-theme-tsed/src/install";

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  try {
    Vue.use(VueTsED);
  } catch (er) {
    console.warn("====", er);
  }
};
