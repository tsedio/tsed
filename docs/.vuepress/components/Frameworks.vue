<template>
  <ul class="reset-list flex flex-wrap items-center">
    <li v-for="item in items" class="p-5">
      <ButtonBadge
        :title="item.title"
        color="platinium"
        :src="item.src"
        :href="item.href"
        text-size="normal font-bold"
        bg-color="gray-lighter p-4 shadow-md"
        width="80" />
    </li>
  </ul>
</template>
<script>
export default {
  name: "Frameworks",
  computed: {
    items() {
      const { frameworks = [] } = this.$frontmatter;
      return frameworks;
    }
  }
};
</script>