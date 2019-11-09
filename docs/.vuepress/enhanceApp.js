import VueAnalytics from "vue-analytics";

export default ({
                  Vue, // the version of Vue being used in the VuePress app
                  options, // the options for the root Vue instance
                  router, // the router instance for the app
                  siteData // site metadata
                }) => {
  try {
    Vue.use(VueAnalytics, {
      id: siteData.themeConfig.plugins[0][1].ga,
      router
    });
  } catch (er) {
    console.warn(er);
  }
}
