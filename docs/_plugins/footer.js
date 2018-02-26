(function () {
  'use strict';

  function plugin(hook, vm) {

    hook.mounted(function () {
      let footer = Docsify.dom.create('div', '<footer-page :settings="settings"></footer-page>');
      footer.id = 'footer';

      Docsify.dom.appendTo(Docsify.dom.find('main .content'), footer);

      new Vue({
        data() {
          return {
            settings: {
              githubFile: '',
              routePath: '',
              lang: this.getLang()
            },
          };
        },

        created() {
          hook.doneEach(() => this.update());
        },

        methods: {
          update() {
            this.settings = {
              githubFile: vm.route.file,
              routePath: vm.route.path,
              lang: this.getLang()
            };
          },

          getLang() {
            var lang =  vm.route.path.split('/')[1];
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
  props: ['settings'],
  template: `
    <div class="page-footer">
      <div class="improve-docs">
        <p>{{caughtMistake}}
            <github-edit-page :file="settings.githubFile">{{editPageOnGithub}}</github-edit-page>
        </p>
      </div>
    
      <div class="page-footer-content">
    
        <div class="next-step-header">{{contribute}}</div>
    
        <p>
            {{helpToContribute}}
            <github-repository>{{githubRepository}}</github-repository>
        </p>
    
        <div class="next-step-header">{{license}}</div>
    
        <p>{{releaseUnder}} <a href="#/license">MIT License</a> - © Copyright 2016 - {{date}} - 
        {{documentationGeneratedWith}} <a href="https://docsify.js.org/#/">docsify</a>.</p>
    
        <github-stars></github-stars>
      </div>
    </div>
    `,
  data() {

    return Object.assign({
      caughtMistake: 'Caught a mistake or want to contribute to the documentation?',
      editPageOnGithub: 'Editer la page sur Github',
      contribute: 'Contribuer',
      helpToContribute: 'Help shape the future of Ts.Ed by joining our team and send us pull requests via our',
      githubRepository: 'GitHub repository!',
      license: 'License',
      releaseUnder: 'Released under the',
      documentationGeneratedWith: 'Documentation generated with',
      date: new Date().getFullYear()
    }, $docsify.footer && $docsify.footer[this.settings.lang] || {});
  }
});




