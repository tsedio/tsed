## 1. Package scaffolding

- [x] 1.1 Inspect platform adapter precedents and pin the supported Elysia test version.
- [x] 1.2 Create `@tsed/platform-elysia` metadata, ESM configuration, exports, fixtures, and package documentation.

## 2. Platform boundary

- [x] 2.1 Implement Elysia platform bootstrap, application creation, context lifecycle, layer mapping, and handler error flow.
- [x] 2.2 Implement Elysia request, response, handler, and route conversion abstractions.
- [x] 2.3 Implement and document supported static/body/runtime behavior without Node response emulation.

## 3. Compatibility verification

- [x] 3.1 Add focused unit and integration tests for factories, context lifecycle, response conversion, errors, paths, and Elysia-native multipart bodies.
- [x] 3.2 Add the explicit `PlatformTestSdk` Elysia capability matrix, retaining named skips for unsupported features.

## 4. Public documentation and validation

- [x] 4.1 Add Elysia capability markers, configuration documentation, navigation, and homepage links.
- [x] 4.2 Run package tests, relevant platform tests, build/lint checks, and documentation build; resolve failures.
