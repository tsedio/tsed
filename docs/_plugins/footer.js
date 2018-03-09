(function () {
  'use strict';

  function plugin(hook, vm) {

    hook.mounted(function () {
      let footer = Docsify.dom.create('div', '<footer-page :settings="settings" :footer="footer"></footer-page>');
      footer.id = 'footer';

      Docsify.dom.appendTo(Docsify.dom.find('main .content'), footer);

      new Vue({
        data() {
          const lang = this.getLang();
          return {
            settings: {
              githubFile: '',
              routePath: '',
              lang
            },
            footer: $docsify.footer[lang] || $docsify.footer['en']
          };
        },

        created() {
          hook.doneEach(() => this.update());
        },

        methods: {
          update() {
            const lang = this.getLang();
            this.settings = {
              githubFile: vm.route.file,
              routePath: vm.route.path,
              lang
            };
            this.footer = $docsify.footer[lang] || $docsify.footer['en'];
          },

          getLang() {
            var lang = vm.route.path.split('/')[1];
            if (vm.config.fallbackLanguages.indexOf(lang) > -1) {
              return lang;
            }
            return 'en';
          }
        }
      }).$mount('#footer');
    });
  }

  $docsify.plugins = [].concat(plugin, $docsify.plugins);
}());

Vue.component('footer-page', {
  props: ['footer', 'settings'],
  template: `
    <div class="page-footer">
      <div class="improve-docs">
        <p>{{footer.caughtMistake}}
            <github-edit-page :file="settings.githubFile">{{footer.editPageOnGithub}}</github-edit-page>
        </p>
      </div>
    
      <div class="page-footer-content">
    
        <div class="next-step-header">{{footer.contribute}}</div>
    
        <p>
            {{footer.helpToContribute}}
            <github-repository>{{footer.githubRepository}}</github-repository>
        </p>
    
        <div class="next-step-header">{{footer.license}}</div>
    
        <p>{{footer.releaseUnder}} <a href="#/license">MIT License</a> - © Copyright 2016 - {{date}} - 
        {{footer.documentationGeneratedWith}} <a href="https://docsify.js.org/#/">docsify</a>.</p>
    
        <github-stars></github-stars>
      </div>
    </div>
    `,
  data() {
    return {
      date: new Date().getFullYear()
    };
  }
});




