---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Ts.ED"
  text: "A TypeScript Framework on top of Express/Koa.js."
  tagline: "Build your awesome server-side application"
  actions:
    - theme: brand
      text: What is Ts.ED?
      link: /introduction/what-is-tsed
    - theme: alt
      text: Getting started
      link: /introduction/getting-started
    - theme: alt
      text: Become sponsor
      link: https://github.com/sponsors/Romakita

features:
  - title: Rest API
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-server"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
    details: Create your Rest API easily and create different version paths of your API compliant with <a class="home-link" href="/tutorials/swagger.html">OpenSpec</a> and <a class="home-link" href="/docs/model.html">JsonSchema</a>.
  - title: Configuration
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bolt"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="4"/></svg>
    details: Don't waste your time with configuration, the server is preconfigured to start quickly! Try our <a class="home-link" href="/getting-started/#installation">CLI</a>.
  - title: Plugins
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unplug"><path d="m19 5 3-3"/><path d="m2 22 3-3"/><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"/><path d="M7.5 13.5 10 11"/><path d="M10.5 16.5 13 14"/><path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"/></svg>
    details: Choose between different plugins to create your own stack.
  - title: Class based
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>
    details: Define class as <a class="home-link" href="/docs/controllers.html">Controller</a>, <a class="home-link" href="/docs/model.html">Model</a>, <a class="home-link" href="/docs/providers.html">Providers</a> (DI), <a class="home-link" href="/docs/pipes.html">Pipes</a>, <a class="home-link" href="/docs/middlewares.html">Middlewares</a>, etc...
  - title: Decorators
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>
    details: A lot of decorators are provided to structure your code and define routes and methods.
  - title: Testing
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>
    details: To test or not to test? isn't a question. Ts.ED embeds some features to test your code! <a class="home-link" href="/docs/testing.html">See more</a>.
frameworks:
  - title: Node.js
    href: https://nodejs.org/
    src: /nodejs.png
  - title: Bun
    href: https://bun.sh/
    src: /bun.png
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
  - title: Vitest
    href: https://vitest.dev/
    src: /vitest.png
  - title: Mocha
    href: https://mochajs.org/
    src: /mochajs.svg
  - title: Babel
    href: https://babeljs.io/
    src: /babel.svg
  - title: Webpack
    href: https://webpack.js.org/
    src: /webpack.svg
  - title: SWC
    href: https://swc.rs/
    src: /swc.png
  - title: AJV
    href: /tutorials/ajv.html
    src: https://ajv.js.org/img/ajv.svg
  - title: Swagger
    href: /tutorials/swagger.html
    src: /swagger.svg
  - title: Passport
    href: /tutorials/passport.html
    src: /passportjs.png
  - title: Mongoose
    href: /tutorials/mongoose.html
    src: /mongoose.png
  - title: Prisma
    href: /tutorials/prisma.html
    src: /prisma-3.svg
  - title: MikroORM
    href: /tutorials/mikroorm.html
    src: https://mikro-orm.io/img/logo.svg
  - title: TypeORM
    href: /tutorials/typeorm.html
    src: /typeorm.png
  - title: IORedis
    href: /tutorials/ioredis.html
    src: /ioredis.svg
  - title: Apollo
    href: /tutorials/graphql-apollo.html
    src: /apollo-graphql-compact.svg
  - title: TypeGraphQL
    href: /tutorials/graphql-typegraphql.html
    src: /typegraphql.png
  - title: Nexus
    href: /tutorials/graphql-nexus.html
    src: /nexus.png
  - title: GraphQL WS
    href: /tutorials/graphql-ws.html
    src: /graphql-ws.png
  - title: Socket.io
    href: /tutorials/socket-io.html
    src: /socketio.svg
  - title: AWS
    href: /tutorials/aws.html
    src: /aws.png
  - title: OIDC
    href: /tutorials/oidc.html
    src: https://oauth.net/images/oauth-logo-square.png
  - title: Stripe
    href: /tutorials/stripe.html
    src: /stripe.svg
  - title: Seq
    href: /tutorials/seq.html
    src: https://blog.datalust.co/content/images/2018/09/Seq-380px-1.png
  - title: LogEntries
    href: https://logentries.com/
    src: /logentries.svg
  - title: Insight
    href: /docs/logger.html
    src: /rapid7.svg
  - title: RabbitMQ
    href: /docs/logger.html
    src: /rabbitmq.svg
  - title: Loggly
    href: /docs/logger.html
    src: /loggly.svg
  - title: LogStash
    href: /docs/logger.html
    src: /elastic-logstash.svg
  - title: Slack
    href: /docs/logger.html
    src: /slack.svg
  - title: Keycloak
    href: /tutorials/keycloak.html
    src: /keycloak_icon.svg
  - title: Agenda
    href: /tutorials/agenda.html
    src: /agenda.svg
  - title: Serverless
    href: /tutorials/serverless.html
    src: /serverless.svg
  - title: Terraform
    href: /docs/platform-serverless.html
    src: /terraform.png
  - title: Terminus
    href: /tutorials/terminus.html
    src: /package.svg
  - title: Temporal
    href: /tutorials/temporal.html
    src: /temporal.svg
  - title: BullMQ
    href: /tutorials/bullmq.html
    src: /bullmq.png
  - title: Vike
    href: /tutorials/vike.html
    src: /vike.svg
  - title: Pulse
    href: /tutorials/pulse.html
    src: /pulse.png
partners:
  - title: eGain
    href: https://www.egain.com/
    src: /partners/egain.webp
  - title: PXR-tech
    href: https://pxr.homerun.co/
    src: https://cdn.homerun.co/52878/logo-donker1665669278logo.png
    class: "max-w-[100px]"
  - title: Weseek
    href: https://weseek.co.jp/
    src: https://avatars.githubusercontent.com/u/6468105?v=4
    class: "max-w-[100px]"
  - title: Zenika
    href: https://www.zenika.com
    src: /partners/zenika.svg
  - title: Club Med
    href: https://clubmed.fr/
    src: /partners/clubmed.svg
  - title: schnell.digital
    href: https://schnell.digital/
    src: /partners/schnell.svg
    class: "max-w-[120px]"
---

<script setup>
import HomeContainer from "@tsed/vitepress-theme/organisms/home/HomeContainer.vue";
import { VPTeamMembers } from "vitepress/theme";
import team from "./team.json";

const members = team.map((member) => {
   return {
     avatar: member.src,
     name: member.title + " - " + member.job,
     title: member.role,
     links: [
        { icon: "github", link: "https://github.com/" + member.github },
        member.twitter && { icon: "twitter", link: "https://x.com/" + member.twitter }
     ].filter(Boolean)
   };
});
</script>

<HomeContainer animate class="mx-0 px-0">
   <div class="text-2xl sm:text-5xl text-center pb-5 mt-20">Team members</div>

   <VPTeamMembers size="small" :members="members" />
</HomeContainer>
