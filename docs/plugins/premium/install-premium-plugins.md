---
head:
  - - meta
    - name: description
      content: Installation instructions for premium plugins in Ts.ED. Learn how to install and configure private packages from GitHub.
  - - meta
    - name: keywords
      content: Ts.ED create plugins marketplace premium guide installation
---

# Installing a Premium Plugin

Premium (private) Ts.ED plugins are distributed as private packages via GitHub's npm registry. To access and install
them, you must:

1. **Become a sponsor of Ts.ED at the required tier**
2. **Generate a GitHub Personal Access Token (PAT) with the correct permissions**
3. **Configure your project to use the token when installing packages**

## 1. Become a Ts.ED Sponsor

To access premium plugins, you must be an active sponsor at least at
the [Power Dev tier](https://github.com/sponsors/Romakita/sponsorships?tier_id=489429&preview=false).

- For higher tiers and benefits, visit the [Ts.ED sponsorship page](https://github.com/romakita/sponsors).
- After subscribing, you'll receive a confirmation email with a link to access the private packages.

::: warning
**You must be a sponsor to access Ts.ED's private packages.**
:::

## 2. Generate a GitHub Personal Access Token

You need a GitHub Personal Access Token (PAT) with the `read:packages` scope. Here's how to create one:

1. Go to your **GitHub Account Settings**.
2. Navigate to **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
3. Click **Generate new token**.
4. Select the **`read:packages`** scope (you can uncheck other scopes for security).
5. Click **Generate token** and copy the resulting token.  
   _**Keep your token secret!**_

## 3. Configure Your Project

You must configure your package manager to use your token for the `@tsedio` scope.  
**Replace `GH_TOKEN` below with your actual token or use an environment variable such as `${GH_TOKEN}`.**

### Using npm or pnpm

Create or update a `.npmrc` file **at the root of your project** (or in your user home directory for global use):

```ini
@tsedio:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=GH_TOKEN
```

- For **pnpm**, this configuration is also valid.

### Using Yarn v1

Add or update a `.yarnrc` file:

```
"@tsedio:registry" "https://npm.pkg.github.com"
```

### Using Yarn v2+ (Berry)

Add or update a `.yarnrc.yml` file:

```yaml
npmScopes:
  tsedio:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAlwaysAuth: true
```

### Security Recommendations

- Never commit your personal access token to version control.
- Prefer using environment variables (e.g., replace `GH_TOKEN` with `${GH_TOKEN}`) and inject them as part of your CI/CD
  pipeline or local environment.

## 4. Install the Premium Plugin

Once configured, you can install premium Ts.ED plugins as usual:

```sh
npm install @tsedio/your-premium-plugin
# or
yarn add @tsedio/your-premium-plugin
# or
pnpm add @tsedio/your-premium-plugin
```

## Troubleshooting

- **401 Unauthorized or 403 Forbidden**: Ensure your sponsorship is active, the PAT has the `read:packages` scope, and
  your `.npmrc` or `.yarnrc*` files are correctly set up.
- **Still need help?** Contact [support](mailto:contact@tsed.io) with your GitHub username and details.
