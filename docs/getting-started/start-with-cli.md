---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
projects:
 - title: Kit basic
   href: https://github.com/TypedProject/tsed-getting-started
   src: /tsed.png
 - title: Kit React
   href: https://github.com/TypedProject/tsed-example-react
   src: /react.png
 - title: Kit Vue.js
   href: https://github.com/TypedProject/tsed-example-vuejs
   src: /vuejs.png    
 - title: Kit TypeORM
   href: https://github.com/TypedProject/tsed-example-typeorm
   src: /typeorm.png
 - title: Kit Mongoose
   href: https://github.com/TypedProject/tsed-example-mongoose
   src: /mongoose.png
 - title: Kit Socket.io
   href: https://github.com/TypedProject/tsed-example-socketio
   src: /socketio.png 
 - title: Kit Passport.js
   href: https://github.com/TypedProject/tsed-example-passportjs
   src: /passportjs.png
 - title: Kit AWS
   href: https://github.com/TypedProject/tsed-example-aws
   src: /aws.png
 - title: Kit Azure AD
   href: https://github.com/TypedProject/tsed-example-passport-azure-ad
   src: /azure.png
meta:
 - name: description
   content: Start a new REST application with Ts.ED CLI. Ts.ED is built on top of Express and uses TypeScript language.
 - name: keywords
   content: getting started ts.ed express typescript node.js javascript decorators mvc class models
---
# Create application with CLI

To get started, you can either scaffold the project with the Ts.ED CLI, or clone a starter project (see.

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