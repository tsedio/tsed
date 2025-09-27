# Ts.ED Development Guidelines

## Build/Configuration Instructions

### Project Structure

This is a **Lerna-managed monorepo** with the following package categories:

- `packages/platform/*` - Platform adapters (Express, Fastify, Koa, etc.)
- `packages/orm/*` - ORM integrations (Mongoose, Prisma, MikroORM, etc.)
- `packages/graphql/*` - GraphQL integrations (Apollo, TypeGraphQL)
- `packages/security/*` - Security plugins (Passport, OIDC, JWKS)
- `packages/specs/*` - Schema and specification tools (AJV, JSON Schema, Swagger)
- `packages/third-parties/*` - Third-party integrations
- `packages/utils/*` - Utility packages

### Setup Instructions

```bash
# Install dependencies (uses Yarn workspaces)
yarn install

# Configure monorepo (generates package references)
yarn configure

# Build all packages
yarn build

# Generate API documentation
yarn api:build
```

### Key Configuration Files

- **Lerna Config**: Uses Yarn as npm client, manages 8+ package categories
- **TypeScript**: Uses project references (`tsconfig.json` -> `tsconfig.node.json` + `tsconfig.spec.json`)
- **ESLint**: Comprehensive config with TypeScript, Prettier, import sorting, workspace rules
- **Vitest**: Multi-project setup with individual configs per package

## Testing Information

### Test Framework: Vitest

The project uses **Vitest** with a multi-project configuration where each package has its own `vitest.config.mts`.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests by category
yarn test:core        # Core packages (@tsed/{core,di,config,hooks,engines})
yarn test:platform    # Platform packages (@tsed/platform-*)
yarn test:specs       # Schema packages (@tsed/{ajv,exceptions,json-mapper,schema,swagger})
yarn test:orm         # ORM packages (@tsed/{adapters,mongoose,prisma,etc})
yarn test:graphql     # GraphQL packages (@tsed/{apollo,typegraphql})
yarn test:security    # Security packages (@tsed/{jwks,oidc-provider,passport})
yarn test:third-parties # Third-party integrations

# Run specific package tests
cd packages/specs/schema && yarn test

# Run with coverage
yarn test # (coverage enabled by default in individual packages)
```

### Test Structure

- **Location**: Tests are co-located with source files using `.spec.ts` extension
- **Pattern**: Uses `describe`/`it` blocks with Vitest's `expect` assertions
- **Configuration**: Each package uses shared presets from `@tsed/vitest/presets`

### Example Test Pattern

```typescript
import {describe, it, expect} from "vitest";

describe("Feature Name", () => {
  it("should test specific behavior", () => {
    const result = someFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Running Individual Tests

```bash
# From package directory
npx vitest run specific-file.spec.ts

# Watch mode
npx vitest watch

# Coverage
npx vitest run --coverage
```

## Additional Development Information

### Code Style & Linting

- **ESLint**: Uses `@typescript-eslint` with relaxed rules for flexibility
- **Prettier**: Integrated via `eslint-plugin-prettier/recommended`
- **Import Sorting**: Enforced via `eslint-plugin-simple-import-sort`
- **Workspace Rules**: No absolute imports between packages (`eslint-plugin-workspaces`)
- **Test-specific Rules**: Vitest plugin enforces consistent test patterns

### Key Linting Commands

```bash
# Lint all files
yarn test:lint

# Auto-fix linting issues
yarn test:lint:fix

# Format all files
yarn prettier
```

### TypeScript Configuration

- Uses **project references** for efficient builds
- Separate configs for node code and test files
- Base configuration sets `baseUrl: "."`

### Development Workflow

1. **Package Management**: Lerna + Yarn workspaces
2. **Build System**: TypeScript project references with incremental compilation
3. **Testing**: Vitest with per-package configurations
4. **Documentation**: TSDoc for API docs, VitePress for user docs
5. **CI/CD**: Comprehensive test suites run in parallel with concurrency limits

### Documentation Generation

```bash
# Build API documentation
yarn api:build

# Build user documentation
yarn docs:build

# Serve documentation locally
yarn docs:serve
```

### Monorepo Commands

```bash
# Clean all packages
yarn clean

# Sync package dependencies
yarn sync:packages

# Update TypeScript references
yarn build:references

# Run command across all packages
lerna run <command> --stream
```

### Release Process

- Uses **semantic-release** for automated releases
- Conventional commits for changelog generation
- Individual package versioning managed by Lerna

### Performance & Benchmarking

```bash
# Run benchmarks
yarn benchmarks

# Prepare benchmark environment
yarn benchmarks:prepare
```
