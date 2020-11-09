<template>
  <div>
    <div class="showcase relative">
      <div class="hidden lg:block absolute right-0  top-0 opacity-10 z-0 w-1/4 p-5 m-10">
        <img src="/sponsors.svg" alt="https://www.freepik.com/" title="https://www.freepik.com/" />
      </div>
      <div class="w-full max-w-site mx-auto px-5 py-5 relative z-1">
        <div>
          <div class="flex flex-col items-center">
            <h2 class="text-center text-4xl normal-case mb-5 text-blue font-bold"
                v-html="sponsors.title" />

            <p class="text-center font-normal text-normal m-auto max-w-md mb-10" v-html="sponsors.description" />

            <template v-for="(item, index) in sponsors.items">
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
            </template>

            <h3 class="text-xl font-bold mb-10">Our backers</h3>

            <div class="flex flex-wrap justify-center items-stretch pb-5 w-full">
              <OpenCollectiveBackers v-bind="backers.badge" />
            </div>

            <div class="mt-5 mb-5 text-center w-full">
              <Button
                  class="w-full sm:w-1/4 md:w-1/6 mb-5 sm:mx-2"
                  :bg-color="sponsors.cta.bgColor"
                  :color="sponsors.cta.color"
                  rounded="medium"
                  :href="sponsors.cta.url">
                {{ sponsors.cta.label }}
              </Button>

              <Button
                  class="w-full sm:w-1/3 md:w-1/6 mb-5 sm:mx-2"
                  :bg-color="backers.cta.bgColor"
                  :color="backers.cta.color"
                  rounded="medium"
                  :href="backers.cta.url">
                {{ backers.cta.label }}
              </Button>

              <Button
                  bg-color="button-white"
                  color="blue"
                  data-mode="popup"
                  class="w-full sm:w-1/3 md:w-1/6 sm:mx-2 typeform-share"
                  rounded="medium"
                  href="https://form.typeform.com/to/uJLP7anG">
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Button, OpenCollectiveBackers, OpenCollectiveSponsors, Showcase } from "@tsed/vuepress-common";

export default {
  name: "SupportUsBlock",
  components: {
    OpenCollectiveBackers,
    OpenCollectiveSponsors,
    Button,
    Showcase
  },
  computed: {
    backers() {
      const { backers } = this.$page.frontmatter;
      return backers;
    },
    sponsors() {
      const { sponsors } = this.$page.frontmatter;
      return sponsors;
    }
  }
};
</script>