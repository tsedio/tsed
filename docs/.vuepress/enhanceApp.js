import VueAnalytics from "vue-analytics";
import "./style.css";

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

    if (new Date().getTime() < new Date("2020-06-26")) {
      const div = document.createElement("div");
      div.classList.add("news-banner");
      div.innerHTML = `
    <div class="container">
      <div class="news-banner__image">
        <a href="https://artips.fr" target="_blank"><img src="https://artips.fr/resources/img/artips/artips.png" alt="Artips meetup" /></a>
      </div>
      <div class="news-banner__content">
        <span>organize his first online <strong>#meetup</strong> on our Ts.ED framework - <span class="text-orange">25 June 2020</span>. <a href="https://t.co/DllOb3foLh?amp=1" target="_blank">See details here.</a></span>
      </div>
    </div>
    `;
      document.querySelector("body").classList.add("news");
      document.querySelector("body").appendChild(div);
    }
  } catch (er) {
    console.warn("====", er);
  }
}
