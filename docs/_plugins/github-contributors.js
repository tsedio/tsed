Vue.component('github-contributors', {
  template: `
    <div class="contributors">
      <div class="contributors-badge" v-for="contributor in contributors">
          <img :src="contributor.avatar_url">
          <a :href="contributor.url" target="_blank">{{contributor.login}}</a>
      </div>
    </div>
  `,
  data: () => {
    return {
      contributors: []
    };
  },
  mounted() {
    fetch($docsify.repo.replace('/github.com', '/api.github.com/repos') + '/contributors')
      .then((response) => response.json())
      .then(contributors => {
        this.contributors = contributors;
      });
  }
});