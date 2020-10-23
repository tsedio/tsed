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
  classes: bg-gray-lighter
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
 type: cols
 classes:
 title: Our <b>Sponsors</b>
 description: Support this project by becoming a sponsor. Your logo will show up here with a link to your website.
 image:
   src: /sponsors.svg
   href: http://www.freepik.com
   title: Designed by pch.vector / Freepik
 cta:
   label: Become sponsor
   url: https://opencollective.com/tsed#sponsor
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
---

::: slot hero-brand
<span class="block sm:inline mb-10 sm:mb-0 sm:text-bold text-7xl sm:text-5xl font-medium"><span class="text-blue">Ts</span>.ED</span> Framework<br/>
<small>for <a class="text-darker-gray">Node.js</a> and <a class="text-darker-gray">TypeScript</a></small>
:::        

::: slot hero-slogan
Build your awesome server-size **application.** <WordsSlider>#Decorators, #Rest API, #DI, #Controller</WordsSlider>
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

<div class="w-full max-w-site mx-auto px-5 py-5 md:py-10">

<p class="text-center font-normal text-xl m-auto max-w-lg">There are some of the libraries and the technologies that we use or supports with this <strong>framework</strong></p>

<Frameworks />

</div>