Vue.component('github-stars', {
  template: `
  <div class="github-stars">
    <iframe :src="url" allowtransparency="true" frameborder="0" scrolling="0" width="110" height="20"></iframe>
  </div>
  `,
  data: () => {

    const [user, repo] = $docsify.repo.split('github.com/')[1].split('/');

    return {
      url: `https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=watch&count=true`
    };
  }
});