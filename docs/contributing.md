---
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
  title: Our <b>Sponsors / Partners</b>
  description: Support this project by becoming a sponsor. Your logo will show up here with a link to your website.
  image:
    src: /sponsors.svg
    href: http://www.freepik.com
    title: Designed by pch.vector / Freepik
  cta:
    label: Become a sponsor
    url: /support.html
---

# Contributing

## Introduction

First, thank you for considering contributing to Ts.ED! It is people like you that make the open source community such a great community! 😊

We welcome any type of contribution, not just code. You can help with:

- QA: file bug reports, the more details you can give the better (e.g. screenshots with the console open).
- Marketing: writing blog posts, how to's, printing stickers....
- Community: presenting the project at meetups, organizing a dedicated meetup for the local community....
- Code: take a look at the [open issues](https://github.com/tsedio/tsed/issues). Even if you can't write code, commenting on them and showing that you care about a given issue matters. It helps us triage them.
- Money: we welcome financial contributions in full transparency on our [open collective](https://opencollective.com/tsed).

## Your First Contribution

Working on your first Pull Request? You can learn how from this free series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

## Submitting code

Any code change should be submitted as a pull request. The description should explain what the code does and give steps to execute it. The pull request should also contain tests.

The bigger the pull request, the longer it will take to review and merge. Try to break down large pull requests in smaller chunks that are easier to review and merge. It is also always helpful to have some context for your pull request. What was the purpose? Why does it matter to you?

::: warning
Ts.ED project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) as format commit message.

Release note and tagging version are based on the message commits.
If you don't follow the format, our CI won't be able to increment the version correctly and your feature won't be released on NPM.

To write your commit message, see [convention page here](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
:::

## Financial contributions

We also welcome financial contributions in full transparency on our open collective. Anyone can file an expense. If the expense makes sense for the development of the community, it will be "merged" in the ledger of our [open collective](https://opencollective.com/tsed) by the core contributors, and the person who filed the expense will be reimbursed.

## Questions

If you have any questions, create an [issue](https://github.com/tsedio/tsed/issues) (protip: do a quick search first to see if someone else didn't ask the same question before!). You can also reach us at hello@tsed.opencollective.com.

## How to work on Ts.ED

### Setup

Clone your fork of the repository:

```bash
$ git clone https://github.com/YOUR_USERNAME/tsed.git
```

Install npm dependencies with yarn (not with NPM!):

```bash
yarn
```

> After installing dependencies, yarn/npm run the `postinstall` hook and mount all packages with `npm link` (e.g. `yarn run repo:bootstrap`).

Compile TypeScript:

```bash
tsc
# or
yarn tsc
# or
npm run tsc
```

### Test

```bash
yarn test
# or
npm run test
```

### Gflow (optional)

[Gflow](https://www.npmjs.com/package/gflow) is a command line tool to help developers with the Git process used in Ts.ED.

Gflow helps you create a branch from production, rebase and run the tests before pushing your branch on your remote repository.

```bash
npm install -g gflow
```

### Start a feature branch

```bash
git fetch
git branch --no-track -b feat-branch-name origin/production  # !IMPORTANT
yarn

## OR
gflow new feat name_of_feat
```

### Commit & Push a feature

This command rebases your branch feature from the production branch, runs the test, and pushes your branch.

```bash
git commit -m "feat(domain): Your message"
```

> To write your commit message see [convention page](https://www.conventionalcommits.org/en/v1.0.0-beta.4/).

Then:

```bash
npm run test
git fetch
git rebase origin/production
git push -f

# OR using gflow (run fetch, rebase and push for you)
gflow push
```

When your feature is ready to review, you can open a PR on Ts.ED github.

### Finish a feature (repo owner and maintainers)

After the PR has been accepted, the feature will be automatically merged on the master branch, but
your feature isn't merged with the production branch.

To publish your feature on the production branch you need to run this command:

```bash
gflow finish
```

::: tip NOTE
This action works only on the Ts.ED repository (not on your fork).
:::

### Write documentation

Ts.ED uses docsify to convert markdown to HTML. In addition, all documentation in your code will be used to generate
the API documentation. To preview your comments on a class you can run this command:

```
npm run doc:serve
```

### Guidelines

- Ts.ED follows the git flow to generate a release note. To write your commit message see [convention page](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).
- Please try to combine multiple commits before pushing.
- Please use TDD when fixing bugs. This means that you should write a unit test that fails because it reproduces the issue, fixes the issue, and then finally runs the test to ensure that the issue has been resolved. This helps us prevent fixed bugs from happening again in the future.
- Please keep the test coverage at 100%. Write additional unit tests if necessary.
- Please create an issue before sending a PR if it is going to change the public interface of Ts.ED or include significant architecture changes.
- Feel free to ask for help from other members of the Ts.ED team.

<!-- This `CONTRIBUTING.md` is based on @nayafia's template https://github.com/nayafia/contributing-template -->
