<script setup lang="ts">
import {useData} from "vitepress";
import {computed, onMounted, ref} from "vue";

import EvolutionChart, {type BenchmarkHistory} from "./EvolutionChart.vue";

type Gap = {value: number; low: number | null; high: number | null; significant: boolean} | null;
type RouteMetrics = {rps: number | null; p99: number | null; cpuPerRequest: number | null};

interface BenchmarkComparison {
  date: string;
  reference: string;
  latest: string;
  runUrl: string | null;
  config: {rounds: number | null; duration: number | null; connections: number | null};
  environment: {node: string | null; cpu: string | null; cores: number | null; pinned: boolean};
  platforms: {
    platform: string;
    hello: {raw: number | null; reference: number | null; latest: number | null};
    routes: {route: string; reference: RouteMetrics; latest: RouteMetrics; gap: {rps: Gap; cpu: Gap}}[];
    startup: {reference: number | null; latest: number | null; gap: Gap};
  }[];
}

const PLATFORMS: Record<string, string> = {express: "Express", koa: "Koa", fastify: "Fastify"};
const ROUTES: Record<string, {label: string; detail: string}> = {
  hello: {label: "GET /hello", detail: "fixed cost of the framework"},
  users: {label: "GET /users/:id", detail: "validated path and query parameters"},
  "orders-create": {label: "POST /orders", detail: "validated body of 20 items, deserialized and serialized back"},
  "orders-list": {label: "GET /orders?size=500", detail: "serialization of a large typed response"}
};

const {theme} = useData();
const data = ref<BenchmarkComparison | null>(null);
const status = ref<"loading" | "ready" | "error">("loading");
const metric = ref<"rps" | "cpu">("rps");
const history = ref<BenchmarkHistory | null>(null);
const historyStatus = ref<"loading" | "ready" | "error">("loading");

async function load<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

// both requests run together, and each section fails on its own
onMounted(() =>
  Promise.all([
    load<BenchmarkComparison>(theme.value.benchmarksUrl).then(
      (value) => {
        data.value = value;
        status.value = "ready";
      },
      () => (status.value = "error")
    ),
    load<BenchmarkHistory>(`${theme.value.benchmarksUrl}/history`).then(
      (value) => {
        history.value = value.versions?.length > 1 ? value : null;
        historyStatus.value = history.value ? "ready" : "error";
      },
      () => (historyStatus.value = "error")
    )
  ])
);

const thousands = new Intl.NumberFormat("en-US", {maximumFractionDigits: 0});
const formatRps = (value: number | null) => (value === null ? "–" : thousands.format(value));
const signed = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}`;
const formatGap = (gap: Gap) => (gap ? `${signed(gap.value)}%` : "–");
const formatInterval = (gap: Gap) => (gap && gap.low !== null && gap.high !== null ? `[${signed(gap.low)}; ${signed(gap.high)}]` : "");
const gapClass = (gap: Gap) => (!gap || !gap.significant ? "is-noise" : gap.value > 0 ? "is-better" : "is-worse");
// said in text too, so the state does not rely on the color alone
const isNoise = (gap: Gap) => Boolean(gap && !gap.significant);
const share = (value: number | null, raw: number | null) => (value && raw ? `${Math.round((value / raw) * 100)}%` : "–");
const width = (value: number | null, max: number) => `${value && max ? Math.max(2, (value / max) * 100) : 0}%`;

const date = computed(() =>
  data.value ? new Date(data.value.date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"}) : ""
);

const routes = computed(() => {
  const ids = new Set(data.value?.platforms.flatMap((platform) => platform.routes.map((route) => route.route)) ?? []);
  return Object.keys(ROUTES).filter((id) => ids.has(id));
});

const cell = (platform: BenchmarkComparison["platforms"][number], route: string) => {
  const row = platform.routes.find((item) => item.route === route);
  return row ? row.gap[metric.value] : null;
};

// the largest significant req/s gain, shown as the headline
const best = computed(() => {
  let found: {value: number; platform: string; route: string} | null = null;

  for (const platform of data.value?.platforms ?? []) {
    for (const route of platform.routes) {
      const gap = route.gap.rps;

      if (gap?.significant && gap.value > 0 && (!found || gap.value > found.value)) {
        found = {
          value: gap.value,
          platform: PLATFORMS[platform.platform] ?? platform.platform,
          route: ROUTES[route.route]?.label ?? route.route
        };
      }
    }
  }

  return found;
});
</script>

<template>
  <div class="benchmarks">
    <p v-if="status === 'loading'" class="benchmarks-message">Loading the latest benchmark…</p>
    <p v-else-if="status === 'error'" class="benchmarks-message">
      The benchmark results are not available right now. They are produced by the
      <a href="https://github.com/tsedio/tsed/actions/workflows/benchmark.yml">Benchmark workflow</a> after each release.
    </p>

    <template v-else-if="data">
      <div class="benchmarks-summary">
        <div class="benchmarks-versions">
          <span class="benchmarks-version is-reference">v{{ data.reference }}</span>
          <span class="benchmarks-vs">vs</span>
          <span class="benchmarks-version is-latest">v{{ data.latest }}</span>
        </div>
        <p v-if="best" class="benchmarks-headline">
          Up to <strong>{{ signed(best.value) }}% requests per second</strong> on <code>{{ best.route }}</code> with {{ best.platform }}.
        </p>
        <p class="benchmarks-meta">Measured on {{ date }}, v{{ data.reference }} is the last release before the performance work.</p>
      </div>

      <h2 id="evolution">Evolution</h2>
      <p>
        Overall requests per second of each version against v{{ data.reference }}: the geometric mean of the gaps on
        <code>GET /hello</code>, <code>GET /users/:id</code>, <code>POST /orders</code> and <code>GET /orders?size=500</code>. Each version
        comes from the latest run that measured it against v{{ data.reference }} in the same job, so versions measured by different runs
        compare with more noise.
      </p>
      <EvolutionChart v-if="history" :history="history" />
      <p v-else-if="historyStatus === 'loading'" class="benchmarks-message">Loading the history…</p>
      <p v-else class="benchmarks-message">The history of the versions is not available right now.</p>

      <h2 id="framework-overhead">Framework overhead</h2>
      <p>
        Requests per second on <code>GET /hello</code>: the same route on the plain framework, without Ts.ED, then on Ts.ED v{{
          data.reference
        }}
        and v{{ data.latest }}. The percentage is the share of the plain framework kept by Ts.ED.
      </p>

      <div class="benchmarks-legend">
        <span><i class="is-raw"></i>Plain framework</span>
        <span><i class="is-reference"></i>Ts.ED v{{ data.reference }}</span>
        <span><i class="is-latest"></i>Ts.ED v{{ data.latest }}</span>
      </div>

      <div class="benchmarks-bars">
        <div v-for="platform in data.platforms" :key="platform.platform" class="benchmarks-platform">
          <h3>{{ PLATFORMS[platform.platform] ?? platform.platform }}</h3>
          <div
            v-for="bar in [
              {key: 'raw', label: 'Plain', value: platform.hello.raw},
              {key: 'reference', label: `v${data.reference}`, value: platform.hello.reference},
              {key: 'latest', label: `v${data.latest}`, value: platform.hello.latest}
            ]"
            :key="bar.key"
            class="benchmarks-bar-row"
          >
            <span class="benchmarks-bar-label">{{ bar.label }}</span>
            <span class="benchmarks-bar-track">
              <span
                class="benchmarks-bar"
                :class="`is-${bar.key}`"
                :style="{
                  width: width(bar.value, Math.max(platform.hello.raw ?? 0, platform.hello.reference ?? 0, platform.hello.latest ?? 0))
                }"
              ></span>
            </span>
            <span class="benchmarks-bar-value">
              {{ formatRps(bar.value) }} req/s
              <small v-if="bar.key !== 'raw'">{{ share(bar.value, platform.hello.raw) }}</small>
            </span>
          </div>
        </div>
      </div>

      <h2 id="per-route">From v{{ data.reference }} to v{{ data.latest }}</h2>
      <p>
        Gap per route from v{{ data.reference }} to v{{ data.latest }}, with its 95% confidence interval. Positive is better: more requests
        per second, or less CPU time per request. A gap whose interval contains 0 is within the noise of the measurement.
      </p>

      <div class="benchmarks-switch" role="group" aria-label="Metric">
        <button type="button" :aria-pressed="metric === 'rps'" :class="{active: metric === 'rps'}" @click="metric = 'rps'">
          Requests per second
        </button>
        <button type="button" :aria-pressed="metric === 'cpu'" :class="{active: metric === 'cpu'}" @click="metric = 'cpu'">
          CPU per request
        </button>
      </div>

      <div class="benchmarks-table-wrapper">
        <table class="benchmarks-table">
          <thead>
            <tr>
              <th>Route</th>
              <th v-for="platform in data.platforms" :key="platform.platform">{{ PLATFORMS[platform.platform] ?? platform.platform }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="route in routes" :key="route">
              <td>
                <code>{{ ROUTES[route].label }}</code>
                <small>{{ ROUTES[route].detail }}</small>
              </td>
              <td v-for="platform in data.platforms" :key="platform.platform" :class="gapClass(cell(platform, route))">
                <strong>{{ formatGap(cell(platform, route)) }}</strong>
                <small>{{ formatInterval(cell(platform, route)) }}</small>
                <small v-if="isNoise(cell(platform, route))">within noise</small>
              </td>
            </tr>
            <tr>
              <td>
                Cold start
                <small>from the process spawn to the first response</small>
              </td>
              <td v-for="platform in data.platforms" :key="platform.platform" :class="gapClass(platform.startup.gap)">
                <strong>{{ formatGap(platform.startup.gap) }}</strong>
                <small>{{ formatInterval(platform.startup.gap) }}</small>
                <small v-if="isNoise(platform.startup.gap)">within noise</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="methodology">How it is measured</h2>
      <ul>
        <li>
          Both versions run the same application with the same versions of Express, Koa and Fastify, in {{ data.config.rounds }} interleaved
          rounds of {{ data.config.duration }} s per route ({{ data.config.connections }} connections, autocannon).
        </li>
        <li>
          One GitHub Actions machine: {{ data.environment.cpu }}, {{ data.environment.cores }} cores, Node.js {{ data.environment.node
          }}{{ data.environment.pinned ? ", server pinned on its own core" : "" }}. Absolute numbers depend on that machine: compare the
          numbers of this page with each other only.
        </li>
        <li>
          Sources: <a href="https://github.com/tsedio/tsed/tree/production/tools/benchmarks">tools/benchmarks</a>
          <template v-if="data.runUrl">, <a :href="data.runUrl">results of this run</a></template
          >.
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.benchmarks {
  --bench-raw: var(--vp-c-text-3);
  --bench-reference: color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
  --bench-latest: var(--vp-c-brand-1);
}

.benchmarks-message {
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.benchmarks-summary {
  margin: 24px 0 8px;
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.benchmarks-versions {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  font-weight: 700;
}

.benchmarks-version {
  font-size: 28px;
  line-height: 1.2;
}

.benchmarks-version.is-latest {
  color: var(--vp-c-brand-1);
}

.benchmarks-version.is-reference {
  color: var(--vp-c-text-2);
}

.benchmarks-vs {
  color: var(--vp-c-text-3);
}

.benchmarks-headline {
  margin: 12px 0 0;
  font-size: 18px;
}

.benchmarks-meta {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.benchmarks-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.benchmarks-legend i {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 6px;
  border-radius: 3px;
  vertical-align: -1px;
}

.benchmarks-legend i.is-raw,
.benchmarks-bar.is-raw {
  background: var(--bench-raw);
}

.benchmarks-legend i.is-reference,
.benchmarks-bar.is-reference {
  background: var(--bench-reference);
}

.benchmarks-legend i.is-latest,
.benchmarks-bar.is-latest {
  background: var(--bench-latest);
}

.benchmarks-bars {
  display: grid;
  gap: 24px;
}

.benchmarks-platform h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.benchmarks-bar-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 150px;
  align-items: center;
  gap: 12px;
  margin: 6px 0;
  font-size: 14px;
}

.benchmarks-bar-label {
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.benchmarks-bar-track {
  height: 20px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.benchmarks-bar {
  display: block;
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.benchmarks-bar-value {
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}

.benchmarks-bar-value small {
  margin-left: 6px;
  color: var(--vp-c-text-3);
}

.benchmarks-switch {
  display: inline-flex;
  margin: 8px 0 16px;
  padding: 3px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.benchmarks-switch button {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.benchmarks-switch button.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-1);
}

.benchmarks-table-wrapper {
  overflow-x: auto;
}

.vp-doc .benchmarks-table {
  display: table;
  width: 100%;
  margin: 0;
}

.benchmarks-table td small {
  display: block;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.4;
}

.benchmarks-table td:not(:first-child) {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.benchmarks-table td.is-better strong {
  color: var(--vp-c-green-1);
}

.benchmarks-table td.is-worse strong {
  color: var(--vp-c-red-1);
}

.benchmarks-table td.is-noise strong {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

@media (max-width: 640px) {
  .benchmarks-bar-row {
    grid-template-columns: 60px minmax(0, 1fr);
  }

  .benchmarks-bar-value {
    grid-column: 2;
    text-align: left;
  }
}
</style>
