<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

type Gap = {value: number; low: number | null; high: number | null; significant: boolean} | null;

export interface BenchmarkHistory {
  reference: string;
  routes: string[];
  versions: {
    version: string;
    date: string | null;
    trigger: string | null;
    runUrl: string | null;
    platforms: {platform: string; score: number | null; routes: {route: string; gap: Gap}[]}[];
  }[];
}

const props = defineProps<{history: BenchmarkHistory}>();

// fixed order: the color and the marker follow the platform, never its rank
const SERIES = [
  {platform: "express", label: "Ts.ED Express", marker: "circle"},
  {platform: "koa", label: "Ts.ED Koa", marker: "square"},
  {platform: "fastify", label: "Ts.ED Fastify", marker: "triangle"}
] as const;

const HEIGHT = 280;
const MARGIN = {top: 16, right: 16, bottom: 32, left: 48};

const root = ref<HTMLElement | null>(null);
const width = ref(720);
const active = ref<number | null>(null);
let observer: ResizeObserver | undefined;

onMounted(() => {
  if (!root.value) {
    return;
  }

  width.value = root.value.clientWidth || width.value;
  observer = new ResizeObserver(([entry]) => {
    width.value = Math.max(280, Math.round(entry!.contentRect.width));
  });
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());

const signed = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
const formatScore = (value: number | null | undefined) => (value === null || value === undefined ? "–" : signed(value));
const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) : "reference";

const versions = computed(() => props.history.versions);
const score = (index: number, platform: string) =>
  versions.value[index]?.platforms.find((item) => item.platform === platform)?.score ?? null;
const series = computed(() =>
  SERIES.filter((item) => versions.value.some((_, index) => index > 0 && score(index, item.platform) !== null))
);

const plot = computed(() => ({
  left: MARGIN.left,
  right: width.value - MARGIN.right,
  top: MARGIN.top,
  bottom: HEIGHT - MARGIN.bottom
}));

// clean ticks of 5 or 10 points that always include 0
const scale = computed(() => {
  const values = versions.value
    .flatMap((_, index) => series.value.map((item) => score(index, item.platform)))
    .filter((value) => value !== null);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const step = max - min > 40 ? 10 : 5;
  const low = Math.floor(min / step) * step;
  const high = Math.max(low + step, Math.ceil(max / step) * step);
  const ticks = Array.from({length: Math.round((high - low) / step) + 1}, (_, index) => low + index * step);

  return {low, high, ticks};
});

const x = (index: number) => {
  const count = versions.value.length;
  const {left, right} = plot.value;

  return count < 2 ? (left + right) / 2 : left + (index * (right - left)) / (count - 1);
};

const y = (value: number) => {
  const {low, high} = scale.value;
  const {top, bottom} = plot.value;

  return bottom - ((value - low) / (high - low)) * (bottom - top);
};

// a version label needs about 48px: thin them out on narrow screens, always keep the last one
const labelEvery = computed(() => {
  const room = (plot.value.right - plot.value.left) / Math.max(1, versions.value.length - 1);

  return Math.max(1, Math.ceil(48 / room));
});

const showLabel = (index: number) => {
  const last = versions.value.length - 1;

  return index === last || (index % labelEvery.value === 0 && last - index >= labelEvery.value);
};

// the last label ends on its point so it never overflows the chart
const labelAnchor = (index: number) => (index > 0 && index === versions.value.length - 1 ? "end" : "middle");

// the line breaks where a version has no score
const path = (platform: string) => {
  let draw = "";
  let open = false;

  versions.value.forEach((_, index) => {
    const value = score(index, platform);

    if (value === null) {
      open = false;
      return;
    }

    draw += `${open ? "L" : "M"}${x(index).toFixed(1)},${y(value).toFixed(1)}`;
    open = true;
  });

  return draw;
};

const points = (platform: string) =>
  versions.value.flatMap((item, index) => {
    const value = score(index, platform);
    return value === null ? [] : [{index, version: item.version, value, cx: x(index), cy: y(value)}];
  });

const markerPath = (marker: string, cx: number, cy: number) => {
  if (marker === "square") {
    return `M${cx - 4},${cy - 4}h8v8h-8z`;
  }

  if (marker === "triangle") {
    return `M${cx},${cy - 5}L${cx + 5},${cy + 4}L${cx - 5},${cy + 4}z`;
  }

  return `M${cx - 4.5},${cy}a4.5,4.5 0 1,0 9,0a4.5,4.5 0 1,0 -9,0`;
};

const latest = computed(() => {
  const index = versions.value.length - 1;
  return {version: versions.value[index]?.version, index};
});

const summary = computed(() => {
  const {version, index} = latest.value;
  const values = series.value.map((item) => `${item.label} ${formatScore(score(index, item.platform))}`).join(", ");

  return `Overall requests per second against v${props.history.reference}, from v${props.history.reference} to v${version}. At v${version}: ${values}.`;
});

// hover: one column per version, the tooltip shows the three scores
const columnWidth = computed(() => (plot.value.right - plot.value.left) / Math.max(1, versions.value.length - 1));
const tooltipStyle = computed(() => {
  if (active.value === null) {
    return {};
  }

  const left = x(active.value);
  const flip = left > width.value - 180;

  return {left: `${flip ? left - 12 : left + 12}px`, top: `${MARGIN.top}px`, transform: flip ? "translateX(-100%)" : "none"};
});
</script>

<template>
  <div class="evolution">
    <div class="evolution-legend">
      <span v-for="item in series" :key="item.platform" :class="`is-${item.platform}`">
        <svg width="24" height="12" aria-hidden="true">
          <line x1="0" y1="6" x2="24" y2="6" class="evolution-line" />
          <path :d="markerPath(item.marker, 12, 6)" class="evolution-marker" />
        </svg>
        {{ item.label }} <strong>{{ formatScore(score(latest.index, item.platform)) }}</strong>
      </span>
    </div>

    <div ref="root" class="evolution-chart" @mouseleave="active = null">
      <svg :width="width" :height="HEIGHT" :viewBox="`0 0 ${width} ${HEIGHT}`" role="img" :aria-label="summary">
        <g class="evolution-grid">
          <g v-for="tick in scale.ticks" :key="tick">
            <line :x1="plot.left" :x2="plot.right" :y1="y(tick)" :y2="y(tick)" :class="{'is-zero': tick === 0}" />
            <text :x="plot.left - 8" :y="y(tick)" text-anchor="end" dominant-baseline="middle">{{ tick > 0 ? "+" : "" }}{{ tick }}%</text>
          </g>
          <template v-for="(item, index) in versions" :key="item.version">
            <text v-if="showLabel(index)" :x="x(index)" :y="plot.bottom + 20" :text-anchor="labelAnchor(index)">{{ item.version }}</text>
          </template>
        </g>

        <line v-if="active !== null" class="evolution-crosshair" :x1="x(active)" :x2="x(active)" :y1="plot.top" :y2="plot.bottom" />

        <g v-for="item in series" :key="item.platform" :class="`is-${item.platform}`">
          <path :d="path(item.platform)" class="evolution-line" />
          <path
            v-for="point in points(item.platform)"
            :key="point.version"
            :d="markerPath(item.marker, point.cx, point.cy)"
            class="evolution-marker"
            :class="{'is-active': point.index === active}"
          >
            <title>{{ item.label }} v{{ point.version }}: {{ formatScore(point.value) }}</title>
          </path>
        </g>

        <rect
          v-for="(item, index) in versions"
          :key="item.version"
          class="evolution-hit"
          :x="x(index) - columnWidth / 2"
          :y="plot.top"
          :width="columnWidth"
          :height="plot.bottom - plot.top"
          @mouseenter="active = index"
        />
      </svg>

      <div v-if="active !== null" class="evolution-tooltip" :style="tooltipStyle" aria-hidden="true">
        <strong>v{{ versions[active]!.version }}</strong>
        <span v-for="item in series" :key="item.platform" :class="`is-${item.platform}`">
          <svg width="12" height="12"><path :d="markerPath(item.marker, 6, 6)" class="evolution-marker" /></svg>
          {{ item.label }} <b>{{ formatScore(score(active, item.platform)) }}</b>
        </span>
        <small>{{ formatDate(versions[active]!.date) }}</small>
      </div>
    </div>

    <div class="evolution-table-wrapper">
      <table class="evolution-table">
        <caption>
          Overall req/s gap against v{{
            history.reference
          }}, per version
        </caption>
        <thead>
          <tr>
            <th scope="col">Version</th>
            <th v-for="item in series" :key="item.platform" scope="col">{{ item.label.replace("Ts.ED ", "") }}</th>
            <th scope="col">Run</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in versions" :key="item.version">
            <th scope="row">{{ item.version }}</th>
            <td v-for="serie in series" :key="serie.platform">{{ index === 0 ? "0%" : formatScore(score(index, serie.platform)) }}</td>
            <td>
              <a v-if="item.runUrl" :href="item.runUrl">{{ formatDate(item.date) }}</a>
              <template v-else>{{ formatDate(item.date) }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* categorical slots 1 to 3 of the validated reference palette, with their dark steps */
.evolution {
  --evo-express: #2a78d6;
  --evo-koa: #eb6834;
  --evo-fastify: #1baf7a;
  --evo-grid: var(--vp-c-divider);
  --evo-surface: var(--vp-c-bg);
}

:global(.dark) .evolution {
  --evo-express: #3987e5;
  --evo-koa: #d95926;
  --evo-fastify: #199e70;
}

.is-express {
  --evo-color: var(--evo-express);
}

.is-koa {
  --evo-color: var(--evo-koa);
}

.is-fastify {
  --evo-color: var(--evo-fastify);
}

.evolution-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 16px 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.evolution-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.evolution-legend strong {
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.evolution-chart {
  position: relative;
  width: 100%;
}

.evolution-chart > svg {
  display: block;
  max-width: 100%;
}

.evolution-grid line {
  stroke: var(--evo-grid);
  stroke-width: 1;
}

.evolution-grid line.is-zero {
  stroke: var(--vp-c-text-3);
}

.evolution-grid text {
  fill: var(--vp-c-text-3);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.evolution-line {
  fill: none;
  stroke: var(--evo-color);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.evolution-marker {
  fill: var(--evo-color);
  stroke: var(--evo-surface);
  stroke-width: 2;
  paint-order: stroke;
}

.evolution-marker.is-active {
  stroke-width: 3;
}

.evolution-crosshair {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
}

.evolution-hit {
  fill: transparent;
}

.evolution-tooltip {
  position: absolute;
  display: grid;
  gap: 4px;
  min-width: 160px;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-2);
  font-size: 13px;
  pointer-events: none;
}

.evolution-tooltip span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
}

.evolution-tooltip b {
  margin-left: auto;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.evolution-tooltip small {
  color: var(--vp-c-text-3);
}

.evolution-table-wrapper {
  overflow-x: auto;
}

.vp-doc .evolution-table {
  display: table;
  width: 100%;
  margin: 16px 0 0;
  font-size: 14px;
}

.evolution-table caption {
  padding-bottom: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-align: left;
}

.evolution-table td,
.evolution-table th[scope="row"] {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.evolution-table th[scope="row"] {
  font-weight: 500;
}

@media (max-width: 640px) {
  .vp-doc .evolution-table {
    font-size: 13px;
  }

  .vp-doc .evolution-table th,
  .vp-doc .evolution-table td {
    padding: 6px 5px;
    font-size: 13px;
  }
}
</style>
