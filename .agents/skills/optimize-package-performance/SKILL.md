---
name: optimize-package-performance
description: Find and remove the runtime hot spots of a Ts.ED package without changing its behaviour, with a reproducible benchmark, a CPU profile and non-regression tests. Use when asked to make a package faster, to optimize a serializer, mapper, DI resolution, middleware chain or any per-request code path, to review a performance PR, or when a benchmark shows a regression.
metadata:
  internal: true
---

# Optimize a Ts.ED package

A performance change is a refactor: the output stays the same, only the cost changes. Every step below exists to prove both halves: it is faster, and nothing else moved.

Read [the pitfalls catalogue](references/pitfalls.md) before changing code. It lists the patterns that cost the most in `@tsed/json-mapper` and the behaviour traps their rewrites hit.

## 1. Find the hot path

1. Identify the public entry point that runs per request or per item (for example `serialize()` called by `PlatformResponseFilter`, `deserialize()` called by `platform-params`, `inject()` in a request scope).
2. Find its callers with `rg -n "<entry point>" packages/*/*/src packages/*/src`. They give the realistic options and payloads to benchmark, and the packages whose suites must pass at the end.
3. Read the entry point down to the leaves: every function called once per value, per item or per property is a candidate. Note where it allocates (object spread, rest destructuring, `Object.entries`, `[...x]`, `.map().filter()`, closures) and where it recomputes something that depends only on a class.

## 2. Measure a baseline

Benchmark in the package itself, through Vitest. Its SWC transform emits decorator metadata. `tsx` and esbuild do not, so `@Property()`-based models break under them.

1. Copy [the bench harness](references/bench.spec.ts) to `packages/<path>/test/zz-perf.spec.ts`, fill in the fixtures and scenarios, and keep it out of commits (delete it at the end, or work in a scratch worktree).
2. Build realistic fixtures: a list of models with nested models, arrays, a `Date`, an untyped (`any`) field, the options the real caller passes. Add one large list (hundreds of items) to expose O(n²) behaviour, and one scenario without a schema.
3. Run it. Vitest swallows `console.log`, so the harness appends results to the `BENCH_OUT` file:

   ```bash
   cd packages/<path> && BENCH_OUT=/tmp/bench.txt LABEL=base npx vitest run test/zz-perf.spec.ts --coverage.enabled=false
   ```

4. Check the machine load (`uptime`) first. Other sessions, IDEs and test runs move results by 20% or more. Never compare runs taken at different times: use the A/B loop of step 6.

## 3. Profile

Profile one scenario at a time (`ONLY=<scenario name>`), otherwise the cheap scenarios hide the expensive one. From the package directory:

```bash
rm -rf /tmp/prof
ONLY="20 orders" BENCH_OUT=/tmp/bench.txt npx vitest run test/zz-perf.spec.ts --coverage.enabled=false \
  --pool=forks --execArgv=--cpu-prof --execArgv=--cpu-prof-dir=/tmp/prof
node "$(git rev-parse --show-toplevel)/.agents/skills/optimize-package-performance/references/profile-summary.mjs" /tmp/prof/*.cpuprofile
```

The summary lists self time per function, one table per profile file (`--top=<n>` changes the number of rows, 30 by default). Ignore start-up noise (`readFileUtf8`, `module-runner`, `compileSourceTextModule`, `(idle)`). Line numbers point to the transformed code, so match them by function name. Rank candidates by self time plus the allocations their callers make for them.

## 4. Change one thing at a time

1. Write down the plan (hot spots, expected gain, behaviour risks) and check in with the user before editing when the change touches public behaviour or more than one package (see `AGENTS.md` > Agent workflow).
2. Apply one optimization family, run the bench, keep it only if the gain is clear across two runs. Discard changes under ~5%: they are noise, and they cost review time.
3. Prefer removing work over micro-tuning: hoist a copy out of a loop, cache a per-class result, skip building a context a callee never reads. Keep inline `typeof` checks in per-value code: in json-mapper, replacing them with `isObject()` made the serializer ~15% slower.
4. Never trade public semantics for speed without asking. In json-mapper, the per-object `{...options, self}` copy cost ~5% only, and `self` is public (`JsonHookContext.self`, mongoose `dynamicRef`): it stayed.
5. A fast path must be guarded by identity, not by shape: exact class (`mapper.constructor === Builtin`), unchanged methods (`mapper.serialize === Builtin.prototype.serialize`), and a way to fall back when the user replaces a method, a mapper or an entry between two calls.

## 5. Prove the behaviour did not change

1. For every rewritten construct, list what the old one did implicitly (see the traps in [the pitfalls catalogue](references/pitfalls.md)): holes of sparse arrays, `[].concat` wrapping a single value, own enumerable keys only, a `__proto__` key, option keys leaking to nested calls, overridden methods.
2. Write a non-regression test for each, then run the new tests against the old code. They must pass there too, otherwise they test a behaviour change:

   ```bash
   git stash push -- <changed src files>   # old implementation, new tests
   npx vitest run <new spec> --coverage.enabled=false
   git stash pop
   ```

3. Run the package suite and the suites of the packages found in step 1.2, then `yarn test:lint` and a type check (`npx tsc --noEmit -p packages/<path>/tsconfig.esm.json`). Suites that need Docker (testcontainers) cannot run without it: say so instead of skipping silently.

## 6. Report a fair comparison

Run the A/B loop: old and new code alternated, in the same machine state. The order flips every round, so cache, heat or CPU frequency drift does not always favour the same side, and each label records its round. The loop stops at the first failing run, and `old` always restores the new code before returning:

```bash
FILES=(<changed src files>)   # an array: works in bash and zsh
: > /tmp/ab.txt   # start from an empty file, the harness appends
run() { BENCH_OUT=/tmp/ab.txt LABEL="$1-r$2" npx vitest run test/zz-perf.spec.ts --coverage.enabled=false; }
old() {
  # without changes, stash push saves nothing and the pop would restore an unrelated stash
  git diff --quiet -- "${FILES[@]}" && { echo "no change to compare"; return 1; }
  git stash push -q -- "${FILES[@]}" || return 1
  run before "$1"; local code=$?
  git stash pop -q || { echo "stash pop failed: restore the new code with git stash pop"; return 1; }
  return $code
}

for i in 1 2 3 4; do
  if [ $((i % 2)) -eq 1 ]; then old "$i" && run after "$i"; else run after "$i" && old "$i"; fi \
    || { echo "round $i failed, /tmp/ab.txt is incomplete"; break; }
done
sort -k3 /tmp/ab.txt
```

Put the before/after table in the PR description with the Node version and the scenario. Commit each optimization family on its own as `perf(<scope>): ...`, and the behaviour fixes found on the way as `fix(<scope>): ...`. Delete the bench file before committing.

## Checklist

- [ ] Hot path and its callers identified
- [ ] Baseline measured on realistic fixtures, including a large list
- [ ] Profile read per scenario
- [ ] Each optimization kept only with a clear gain
- [ ] Non-regression tests pass on the old and the new code
- [ ] Package and dependent suites, `yarn test:lint`, type check
- [ ] A/B table in the PR, bench file not committed
