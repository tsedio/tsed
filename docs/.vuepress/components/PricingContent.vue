<template>
  <div>
    <div class="relative max-w-screen-xl mx-auto">

      <h2 class="text-center text-4xl normal-case mb-10 mt-6">Additional <strong>services</strong></h2>

      <div class="sm:flex -mt-10 justify-center">
        <Offer class="w-full sm:w-1/4 justify-items-stretch sm:px-2"
               v-for="item of $site.themeConfig.offers.additionalServices.items" v-bind="item"
               :key="item.title" />
      </div>
    </div>

    <div class="bg-gray-lighter py-10">
      <div class="container flex flex-col w-full max-w-md mx-auto px-3 pb-5 text-center">
        <h3 class="text-xl font-bold mb-10">Why support becomes chargeable?</h3>

        <div class="text-justify">
          <p class="mb-5">
            Ts.ED is an MIT-licensed <strong>Open-Source</strong> project which grows continuously thanks to community's support.
            This framework is a result of the long road, full of sleepless nights, working after hours, and busy
            weekends.
          </p>
          <p class="mb-5">
            <strong>As the author of the framework</strong>, I spend a lot of time to answer your questions as best as possible.
            Some of them are about specific configuration of your project and they needs a quick help from me.
            However, in most cases, issues can be directly addressed to the Ts.ED community and this is what I recommend to do!
          </p>
          <p class="mb-5">
            It happens that some problems are specific to the configuration of your project and therefore require a
            quick
            intervention on my part.
          </p>
          <p class="mb-5">
            It's this intervention that you appreciate, because you know that the <strong>result will be there</strong>.
          </p>
          <p class="mb-5">
            This support must be remunerated at its fair value, and <strong>it's essential to continue working on the
            framework!</strong>.
          </p>
        </div>
      </div>
    </div>
    <div class="bg-blue text-white py-10">
      <div class="container flex flex-col w-full max-w-md mx-auto px-3 pb-5 text-center">
        <h3 class="text-xl font-bold mb-10">Why pay for support?</h3>

        <p>
          The support is a bonus linked to sponsorship. In reality, you become an official sponsor of the framework, and
          you get the advantage of having quality and personalized support.
        </p>
      </div>
    </div>


    <SupportUsBlock />
  </div>
</template>
<script>
export default {
  name: "PricingContent"
};
</script>
