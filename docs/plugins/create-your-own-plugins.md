---
head:
  - - meta
    - name: description
      content: Discover our list of plugins to extends your Ts.ED project. Created by the Ts.ED team and community.
  - - meta
    - name: keywords
      content: Ts.ED create plugins marketplace edit plugins community
projects:
  - title: Template plugins
    href: https://github.com/tsedio/tsed-plugins-starter
    src: /tsed.png
---

# Create your own plugins

Ts.ED is a framework that allows you to create your own plugins to extend its functionality.
This guide will help you understand how to create and publish your own plugins.

## Create a plugin

To help you create your own plugins, we provide a [template](https://github.com/tsedio/tsed-plugins-starter) that you can use as a starting point:

<Projects />

## Features

- **Monorepo structure** — All plugins are organized under the `packages/` directory.
- **CI/CD ready** — GitHub Actions are configured to build and publish packages automatically.
- **Code quality tools** — Includes pre-configured [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), and [Commitlint](https://commitlint.js.org/) to ensure consistency across the codebase.
- **Testing** — Uses [Vitest](https://vitest.dev/) for unit testing.
- **Scalable** — Easily add and manage multiple packages in a single repository.

## Getting Started

After having checked out the repository, you can start developing your plugins. Install project dependencies:

```bash
yarn install
```

## Adding a New Plugin

To create a new plugin in the monorepo:

1. Use the following command to create a new workspace:

   ```bash
   yarn workspace create @tsed/my-plugin
   ```

   Or manually create a folder under `packages/`:

   ```bash
   mkdir packages/my-plugin
   cd packages/my-plugin
   yarn init -y
   ```

2. Copy files from the `packages/plugin-example/` directory to your new plugin directory. The structure should look like this`:

   ```
   packages/
   └── my-plugin/
       ├── src/
       │   └── index.ts
       ├── test/
       │   └── integration.spec.ts (optional)
       ├── .gitignore
       ├── .npmignore
       ├── package.json
       ├── readme.md
       ├── tsconfig.esm.json
       └── vitest.config.mts
   ```

3. Run `yarn build:references` to generate the paths in `tsconfig.*.json` files.
4. Build your plugin:

   ```bash
   yarn build
   ```

## Build

To build all packages in the monorepo and generate their respective `dist/` folders, run:

```bash
yarn build
```

## Publishing Workflow

Package publishing is automated via GitHub Actions.

- Each plugin has its own version defined in its `package.json` but monorepo tools update all package version with the same version number.
- On each push to the `main` branch:
  - The `build.yml` workflow is triggered.
  - It uses semantic release to increment the version based on commit messages.
  - All packages are automatically published to the NPM registry.

You have to configure your GitHub secrets with the following variables:

- NPM_TOKEN: Your NPM token

Go to your GitHub repository settings, then to the "Secrets and variables" section, and add a new secret with the name `NPM_TOKEN` and the value of your NPM token.

## Adding your plugin on the Ts.ED marketplace

Ts.ED marketplace scans regularly the NPM registry to find new plugins.

To appear on the Ts.ED marketplace, you have to publish your plugin on the NPM registry
with one of the following name patterns:

- `tsed-*` in the name of your package,
- `@tsed/*` in the name of your scope
- `@tsed/plugin-*` in the name of your scope and package
- or adding `tsed` in the keywords package.json field.

Thats it! Your plugin will be automatically listed on the Ts.ED marketplace.
