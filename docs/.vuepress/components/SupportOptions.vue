<template>
  <div>
    <ul class="reset-list flex justify-center align-center p-3 flex-wrap -mx-2">
      <li class="p-2">
        <Button
          bg-color="button-white"
          color="blue"
          title="Become a backer or sponsor on OpenCollective"
          href="https://opencollective.com/tsed">
          <BxIcon name="bx-heart" class="mr-1" />
          OpenCollective
        </Button>
      </li>
      <li class="p-2">
        <Button
          bg-color="button-white"
          color="blue"
          title="Become a backer or sponsor on Github sponsor"
          href="https://github.com/sponsors/Romakita">
          <BxIcon name="bxl-github" class="mr-1" />
          Github sponsor
        </Button>
      </li>
      <li class="p-2">
        <Button
          bg-color="button-white"
          color="blue"
          title="Send a one-time donation"
          href="https://paypal.me/romainlenzotti">
          <BxIcon name="bxl-paypal" class="mr-1" />
          Paypal
        </Button>
      </li>
    </ul>

    <h4 class="text-center font-bold">Or</h4>

    <ul class="reset-list flex justify-center align-center p-3 mb-5">
      <li class="p-2">
        <Button
          class="typeform-share"
          data-mode="popup"
          href="/contact">
          <BxIcon name="bx-message-alt-dots" class="mr-1" />
          Contact us directly
        </Button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "SupportOptions"
};
</script>
