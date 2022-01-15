<template>
  <div class="home-body relative">
    <div class="relative overflow-hidden bg-gray-lighter bg-gradient">
      <div class="showcase relative shadow-inner relative z-1">
        <div class="w-full max-w-site mx-auto px-5 py-10 relative z-1">
          <div class="flex flex-col items-center">
            <h2 class="preview-title">Preview</h2>

            <p class="text-center font-normal text-md m-auto max-w-sm pb-0">
              See in our live demo what Ts.ED looks like, without leaving your personal browser.
            </p>

            <div class="w-full pt-5 pb-10 sm:py-10">
              <CodeSandbox
                style="width:100%; height:500px; overflow:hidden;"
                class="rounded-medium border-2 border-gray-darker bg-white"
                sandboxId="tsed-mongoose-example-omkbm"
                title="tsed-mongoose-example"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts">
              </CodeSandbox>

            </div>

            <div>
              <Button
                href="https://codesandbox.io/embed/tsed-mongoose-example-omkbm?fontsize=14&hidenavigation=1&theme=dark"
                rounded="medium"
                bg-color="white-button"
                color="blue">
                Live demo
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute sandbox-logo z-0">
        <svg class="w-full fill-blue"
             viewBox="0 0 256 256"
             version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
          <g>
            <path
              d="M115.497674,261.08837 L115.497674,154.478845 L23.8139535,101.729261 L23.8139535,162.501763 L65.8104558,186.8486 L65.8104558,232.549219 L115.497674,261.08837 Z M139.311628,261.714907 L189.916577,232.563707 L189.916577,185.779949 L232.186047,161.285235 L232.186047,101.27387 L139.311628,154.895035 L139.311628,261.714907 Z M219.971965,80.8276886 L171.155386,52.5391067 L128.292316,77.4106841 L85.1040206,52.5141067 L35.8521355,81.1812296 L127.765737,134.063073 L219.971965,80.8276886 Z M0,222.211907 L0,74.4948807 L127.986799,0 L256,74.1820085 L256,221.978632 L127.983954,295.72283 L0,222.211907 Z"></path>
          </g>
        </svg>
      </div>
    </div>

    <div class="w-full max-w-site mx-auto px-5 py-5 md:py-10">
      <p class="text-center font-normal text-xl m-auto max-w-lg">Here are some of the libraries and technologies
        that we
        use or support with this <strong>framework</strong></p>

      <div class="mt-5 pt-5">
        <Frameworks />
      </div>

      <div class="pt-5">
        <p class="text-center font-normal text-xl m-auto max-w-lg">What's new ?</p>

        <div class="mt-5 pt-5">
          <ReleaseNote style="max-height: 300px" class="overflow-auto" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CodeSandbox, ReleaseNote } from "@tsed/vuepress-common";

export default {
  name: "HomeBody",
  components: {
    ReleaseNote,
    CodeSandbox
  }
};
</script>
<style>
.content__default h2.preview-title {
  @apply text-center text-4xl normal-case p-0 m-0 text-blue;
}

.sandbox-logo {
  @apply absolute flex items-center justify-center left-0 top-0 h-full w-full;

  svg {
    min-width: 800px;
    transform: translateX(3px);
    fill: theme('colors.white');
  }
}
</style>
