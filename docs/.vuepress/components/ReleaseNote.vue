<template>
  <div class="bg-gray-lighter rounded-small p-5 pt-6 mb-5 overflow-auto">
    <Content :page-key="getPageKey($site.pages, '/release')" />
  </div>
</template>
<script>
export default {
  name: "ReleaseNote",
  methods: {
    getPageKey() {
      return this.$site.pages.find(p => p.path === "/release.html").key;
    }
  }
};
</script>