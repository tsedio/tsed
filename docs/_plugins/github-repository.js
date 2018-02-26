Vue.component('github-repository', {
  template: `
    <a :href="url"><slot></slot></a>
  `,
  data: () => {
    return {
      url: $docsify.repo
    };
  }
});