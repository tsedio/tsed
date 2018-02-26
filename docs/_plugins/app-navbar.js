(function () {
  'use strict';

  function plugin(hook, vm) {

    function getLang() {
      const lang = vm.route.path.split('/')[1];
      if (vm.config.fallbackLanguages.indexOf(lang) > -1) {
        return lang;
      }
      return 'en';
    }

    hook.mounted(() => {
      new Vue({
        data() {
          const lang = getLang();
          const menu = JSON.parse(JSON.stringify($docsify.navbar[lang] || $docsify.navbar['en']));

          return {
            settings: {
              name: $docsify.name,
              repo: $docsify.repo,
              lang,
              routePath: vm.route.path,
              menu,
              languages: $docsify.languages || []
            }
          };
        },

        created() {
          hook.doneEach(() => {

            const lang = getLang();
            this.settings = {
              name: $docsify.name,
              repo: $docsify.repo,
              lang,
              routePath: vm.route.path,
              menu: $docsify.navbar[lang] || $docsify['en'],
              languages: $docsify.languages || []
            };
          });
        }
      }).$mount('#app-navbar');
    });
  }

  $docsify.plugins = [].concat(plugin, $docsify.plugins);
}());