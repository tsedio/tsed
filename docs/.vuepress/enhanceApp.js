import VueAnalytics from "vue-analytics";
import VueTsED from "vuepress-theme-tsed/src/install";
import "./styles/style.css";
import "prismjs/components/prism-groovy";

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  try {
    Vue.use(VueTsED);
    //     Vue.component("ReleaseNote", ReleaseNote);
    Vue.use(VueAnalytics, {
      id: siteData.themeConfig.plugins["@vuepress/google-analytics"].ga,
      router
    });
  } catch (er) {
    console.warn("====", er);
  }
};
