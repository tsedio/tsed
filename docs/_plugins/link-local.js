(function () {
  'use strict';

  function plugin(hook, vm) {
    hook.afterEach(function (html) {

      const lang = window.location.hash.split('/')[1];

      if (vm.config.fallbackLanguages.indexOf(lang) > -1) {
        html = html.replace(/href="#\/(.*)"/gi, (link, match) => {

          if (link.indexOf('#/' + lang + '/') === -1) {
            return link.replace('#/', '#/' + lang + '/');
          }

          return link;
        });
      }

      return html;
    });
  }

  $docsify.plugins = [].concat(plugin, $docsify.plugins);
}());