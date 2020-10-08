# Contributing 
## Introduction

First, thank you for considering contributing to Ts.ED! It is people like you that make the open source community such a great community! 😊

We welcome any type of contribution, not just code. You can help with:

- QA: file bug reports, the more details you can give the better (e.g. screenshots with the console open)
- Marketing: writing blog posts, how to's, printing stickers, ...
- Community: presenting the project at meetups, organizing a dedicated meetup for the local community, ...
- Code: take a look at the [open issues](https://github.com/TypedProject/tsed/issues). Even if you can't write code, commenting on them and showing that you care about a given issue matters. It helps us triage them.
- Money: we welcome financial contributions in full transparency on our [open collective](https://opencollective.com/tsed).

## Your First Contribution

Working on your first Pull Request? You can learn how from this free series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

## Submitting code

Any code change should be submitted as a pull request. The description should explain what the code does and give steps to execute it. The pull request should also contain tests.
Code review process

The bigger the pull request, the longer it will take to review and merge. Try to break down large pull requests in smaller chunks that are easier to review and merge. It is also always helpful to have some context for your pull request. What was the purpose? Why does it matter to you?

---
### WARNING

Ts.ED project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) as format commit message.

Release note and tagging version are based on the message commits.
If you don't follow the format, our CI won't be able to increment the version correctly and your feature won't be released on NPM.

To write your commit message, see [convention page here](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
---

## Financial contributions

We also welcome financial contributions in full transparency on our open collective. Anyone can file an expense. If the expense makes sense for the development of the community, it will be "merged" in the ledger of our [open collective](https://opencollective.com/tsed) by the core contributors, and the person who filed the expense will be reimbursed.

## Questions

If you have any questions, create an [issue](https://github.com/TypedProject/tsed/issues) (protip: do a quick search first to see if someone else didn't ask the same question before!). You can also reach us at https://gitter.im/Tsed-io/community.

## How to work on Ts.ED
### Setup

Clone your fork of the repository

```bash
$ git clone https://github.com/YOUR_USERNAME/tsed.git
```

Install npm dependencies with yarn (not with NPM!):
```bash
yarn
```
> After installing dependencies, yarn/npm run the `postinstall` hook and mounted all packages with `npm link` (e.g. `yarn run repo:bootstrap`).

Compile TypeScript:

```bash
yarn build
// or 
npm run build
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

### Submitting your PR

Create the PR on the production branch. A valid PR must follows these points:

- Unit test is correctly implemented and cover the new scenario.
- If the code introduce new feature, please add documentation in the `/docs` or describe the feature in the PR description.
- The commit message follows the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) format.

The review is always takes priority over other tasks. We can validate the PR very quickly if everything is clear and it's aligned with the evolution/vision of the framework.

### Write documentation

Ts.ED use vuepress to convert markdown to web application. In addition, all documentation in your code will be used to generate
the API documentation. To run the website on your local, run this command:

```sh
yarn vuepress:serve
```

### Guidelines

- Ts.ED follows the git flow to generate a release note. To write your commit message see [convention page](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).
- Please try to combine multiple commits before pushing.
- Please use TDD when fixing bugs. This means that you should write a unit test that fails because it reproduces the issue, then fix the issue and finally run the test to ensure that the issue has been resolved. This helps us prevent fixed bugs from happening again in the future.
- Please keep the test coverage. Write additional unit tests if necessary.
- Please create an issue before sending a PR if it is going to change the public interface of Ts.ED or includes significant architecture changes.
- Feel free to ask for help from other members of the Ts.ED team.

## Credits
### Contributors

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>


### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

<!-- This `CONTRIBUTING.md` is based on @nayafia's template https://github.com/nayafia/contributing-template -->
