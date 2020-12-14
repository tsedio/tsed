<template>
  <div class="flex flex-col items-center w-full">
    <h3 class="text-xl font-bold mb-10">{{ item.title }}</h3>

    <div v-if="item.items" class="flex flex-wrap justify-center items-stretch pb-5 mb-8 w-full">
      <div :class="item.class"
           v-for="partner in item.items"
           :key="partner.href">
        <a :href="partner.href" :title="partner.title"
           target="_blank"
           rel="noopener noreferrer"
           class="link external partner-logo flex items-center h-full justify-center">
          <img :src="partner.src" :style="item.style" />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SponsorsBlock",
  props: {
    item: {
      type: Object
    }
  }
};
</script>