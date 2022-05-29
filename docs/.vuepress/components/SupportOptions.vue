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
          Github sponsors
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
            data-mode="popup"
            class="typeform-share"
            href="https://form.typeform.com/to/uJLP7anG">
          <BxIcon name="bx-message-alt-dots" class="mr-1" />
          Reach me directly
        </Button>
      </li>
      <li class="p-2">
        <Button
            bg-color="button-white"
            color="blue"
            title="Contact us by e-mail"
            href="mailto:contact@tsed.io">
          <BxIcon name="bx-envelope" class="mr-1" />
          By e-mail
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
