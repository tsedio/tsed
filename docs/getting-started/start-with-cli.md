---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
projects:
  - title: Kit basic
    href: https://github.com/tsedio/tsed-getting-started
    src: /tsed.png
  - title: Kit React
    href: https://github.com/tsedio/tsed-example-react
    src: /react.png
  - title: Kit Vue.js
    href: https://github.com/tsedio/tsed-example-vuejs
    src: /vuejs.png
  - title: Kit TypeORM
    href: https://github.com/tsedio/tsed-example-typeorm
    src: /typeorm.png
  - title: Kit Mongoose
    href: https://github.com/tsedio/tsed-example-mongoose
    src: /mongoose.png
  - title: Kit Socket.io
    href: https://github.com/tsedio/tsed-example-socketio
    src: /socketio.png
  - title: Kit Passport.js
    href: https://github.com/tsedio/tsed-example-passportjs
    src: /passportjs.png
  - title: Kit AWS
    href: https://github.com/tsedio/tsed-example-aws
    src: /aws.png
  - title: Kit Azure AD
    href: https://github.com/tsedio/tsed-example-passport-azure-ad
    src: /azure.png
meta:
  - name: description
    content: Start a new REST application with Ts.ED CLI. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Create application with CLI

To scaffold the project with the CLI, run the following commands. This will create a new project directory,
and populate the directory with the initial core Ts.ED files and supporting modules, creating a conventional base structure for your project.
Creating a new project with the CLI is recommended for first-time users.

```bash
npm install -g @tsed/cli
tsed init .
```

::: tip
See our [CLI website](https://cli.tsed.io) for more details.
:::

::: warning
If you have to upgrade Ts.ED dependencies, keep in mind this point:

It is really important to keep the same version for all `@tsed/*` (excepted @tsed/logger) packages.
To prevent errors, fix the version for each Ts.ED packages:

```json
{
  "dependencies": {
    "@tsed/common": "6.10.0",
    "@tsed/di": "6.10.0",
    "@tsed/core": "6.10.0",
    "@tsed/exceptions": "6.10.0",
    "@tsed/plaftorm-express": "6.10.0",
    "@tsed/swagger": "6.10.0"
  }
}
```
