---
layout: Home
sidebar: false
meta:
 - name: description
   content: A Node.js and TypeScript Framework on top of Express/Koa.js. Ts.ED is a framework on top of Express/Koa to write your application with TypeScript (or ES6). It provides a lot of decorators and guideline to make your code more readable and less error-prone.
 - name: keywords
   content: Ts.ED nodejs express typescript javascript es6 decorators mvc model ioc service model middleware socket.io swagger typeorm mongoose ajv
gettingStartedText: Getting started
gettingStartedUrl: /getting-started/
messengerText: Gitter
messengerUrl: https://gitter.im/Tsed-io/community
liveDemoUrl: https://codesandbox.io/embed/laughing-kepler-ripfl?fontsize=14&hidenavigation=1&theme=dark
features:
- title: Rest API
  icon: bx-server
  details: Create your Rest API easily and create different version paths of your API.
- title: Configuration
  icon: bx-shape-square
  details: Don't waste your time with configuration, the server is preconfigured to start quickly!
- title: Class based
  icon: bx-diamond
  details: Define class as Controller, Model, Service (DI), Filter, Middleware, Converter etc...
- title: Decorators
  icon: bx-paint
  details: A lot of decorators are provided to structure your code and define route and method.
- title: Testing
  icon: bx-test-tube
  details: To test or not to test? isn't a question. Ts.ED embeds some features to test your code! <a class="underline hover:text-blue-active transition-all" href="/docs/testing.html">See more</a>.
contributors:
  classes: bg-gray-lighter mb-10
  title: Our awesome <b>contributors</b>
  cta:
    label: Become contributor
    url: /contributing.html
  badge:
    width: 45
    bgColor: white
backers:
 type: cols
 title: Our <b>Backers</b>
 description: Thank you to all our backers who contributes to our project! 🙏
 cta:
   label: Become Backers
   url: https://opencollective.com/tsed#backers
sponsors:
 classes:
 title: Support us
 description: Ts.ED is under MIT-license and is an open-source project. Many thanks to our backers/sponsors/partners who contribute to promote and support our project!
 cta:
   label: Become a sponsor
   url: /support.html 
 items:
  - title: Sponsors
    class: w-1/2 sm:w-1/6 px-5 py-3
    style:
      maxHeight: 150px
    items:
      - title: Medayo
        href: https://www.medayo.com
        src: https://images.opencollective.com/medayo/1ef2d6b/logo/256.png
  - title: They use it
    class: w-1/3 sm:w-1/6 px-5 py-3
    style:
      maxHeight: 80px
    items:
      - title: Artips
        href: https://artips.fr
        src: https://artips.fr/resources/img/artips/artips.png
      - title: Yumi.us
        src: https://yumi.us/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F6bc09fed-4612-4aa0-9192-225a0b3c7a30%2FYumi-logo-circle.png?table=block&id=1a875820-287a-4a97-aa40-ba3c8f3de9ae&width=250&userId=&cache=v2
        href: https://yumi.us/
showContent: false
frameworks:
- title: TypeScript
  href: https://www.typescriptlang.org/
  src: /typescript.png 
- title: Express.js
  href: https://expressjs.com/
  src: /expressjs.svg
- title: Koa.js
  href: https://koajs.com/
  src: /koa.svg
- title: Jest
  href: https://jestjs.io/
  src: /jest.svg
- title: Mocha
  href: https://mochajs.org/
  src: /mochajs.svg
- title: AJV
  href: /tutorials/ajv.html
  src: https://ajv.js.org/images/ajv_logo.png
- title: Swagger
  href: /tutorials/swagger.html
  src: /swagger.svg 
- title: Passport
  href: /tutorials/passport.html 
  src: /passportjs.png
- title: Mongoose
  href: /tutorials/mongoose.html
  src: /mongoose.png   
- title: TypeORM
  href: /tutorials/typeorm.html
  src: /typeorm.png
- title: TypeGraphQL
  href: /tutorials/graphql.html
  src: /typegraphql.png
- title: Socket.io
  href: /tutorials/socketio.html
  src: /socketio.svg
- title: AWS
  href: /tutorials/aws.html
  src: /aws.png
---

::: slot hero-brand
<span class="block sm:inline mb-10 sm:mb-0 sm:text-bold text-7xl sm:text-5xl font-medium"><span class="text-blue">Ts</span>.ED</span> Framework<br/>
<small>for <a class="text-darker-gray">Node.js</a> and <a class="text-darker-gray">TypeScript</a></small>
:::        

::: slot hero-slogan
Build your awesome server-side **application.** <WordsSlider>#Decorators, #Rest API, #DI, #Controller</WordsSlider>
:::

::: slot hero-content
<img src="/hero-bg.svg" class="animate-hero" />
:::

::: slot testimonial-title
Why <span class="text-blue">Ts</span>.ED?
:::

::: slot testimonial-content
Ts.ED is a Node.js and TypeScript Framework on top of Express/Koa.js. Ts.ED is a framework on top of Express/Koa to write your application with TypeScript (or ES6). 
It provides a lot of decorators and guideline to make your code more readable and less error-prone.
:::

::: slot features-footer
<div class="hidden sm:block pt-10 pb-5 mt-10">
<h3 class="text-center font-normal text-xl m-auto max-w-lg pb-5">See in our live demo what <span class="text-blue">Ts</span>.ED looks like, without leaving your personal browser.</h3>

<div class="bg-code-active p-5 mt-5 rounded-small">
<iframe src="https://codesandbox.io/embed/tsed-mongoose-example-omkbm?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="tsed-mongoose-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
</div>
</div>
:::

<div class="w-full max-w-site mx-auto px-5 py-5 md:py-10">

<p class="text-center font-normal text-xl m-auto max-w-lg">Here are some of the libraries and technologies that we use or support with this <strong>framework</strong></p>

<div class="mt-5 pt-5">
<Frameworks />
</div>
</div>
