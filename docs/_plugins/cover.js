(function () {
  'use strict';

  function plugin(hook, vm) {
    hook.ready(function () {
      const el1 = Docsify.dom.create('div',
        '<div>' +
        '<div class="sq-1"><div class="sqv-1"></div><div class="sqv-2"></div></div>' +
        '<div class="sq-2"><div class="sqv-1"></div><div class="sqv-2"></div></div>' +
        '<div class="sq-3"><div class="sqv-1"></div><div class="sqv-2"></div></div>' +
        '<div class="sq-4"></div>' +
        '<div class="sq-5"><div class="sqv-1"></div></div>' +
        '<div class="sq-6"><div class="sqv-1"></div><div class="sqv-2"></div><div class="sqv-3"></div></div>' +
        '</div>'
      );
      el1.className = 'cover-bg cover-bg-1';

      const el2 = Docsify.dom.create('div',
        '<div>' +
        '<div class="sq-1"><div class="sqv-1"></div><div class="sqv-2"></div></div>' +
        '<div class="sq-2"><div class="sqv-1"></div><div class="sqv-2"></div></div>' +
        '<div class="sq-3"><div class="sqv-1"></div><div class="sqv-2"></div></div>' +
        '<div class="sq-4"></div>' +
        '<div class="sq-5"><div class="sqv-1"></div></div>' +
        '<div class="sq-6"><div class="sqv-1"></div><div class="sqv-2"></div><div class="sqv-3"></div></div>' +
        '</div>'
      );
      el2.className = 'cover-bg cover-bg-2';

      const sectionCover = Docsify.dom.find('section.cover');
      sectionCover.appendChild(el1);
      sectionCover.appendChild(el2);
    });
  }

  $docsify.plugins = [].concat(plugin, $docsify.plugins);
}());