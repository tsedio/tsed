Vue.component('github-edit-page', {
  template: `
    <a class="improve-docs-link" :href="url">
        <slot></slot>
    </a>
  `,

  props: ['file'],

  data() {
    return {
      url: $docsify.repo + '/blob/master/docs/' + this.file
    };
  }
});