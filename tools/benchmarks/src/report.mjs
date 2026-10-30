import {median, medianOf} from "./stats.mjs";

const ROUTE_LABELS = {
  hello: "GET /hello",
  users: "GET /users/:id",
  "orders-create": "POST /orders (20 items)",
  "orders-list": "GET /orders?size=500"
};

const signed = (value) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}`;

/**
 * Formats a comparison as a gap in percent: `+5.1% [+4.0; +7.0]` followed by the verdict.
 * A ratio above 1 always means better (the ratios of latency and CPU are inverted).
 */
export function formatGap(summary) {
  if (!summary) {
    return "–";
  }

  const gap = `${signed((summary.ratio - 1) * 100)}%`;

  if (Number.isNaN(summary.low)) {
    return `${gap} (1 round)`;
  }

  const interval = `[${signed((summary.low - 1) * 100)}; ${signed((summary.high - 1) * 100)}]`;

  if (!summary.significant) {
    return `${gap} ${interval} not significant`;
  }

  return `**${gap}** ${interval} ${summary.ratio > 1 ? "better" : "worse"}`;
}

const number = (value, digits = 0) => (Number.isFinite(value) ? value.toFixed(digits) : "–");
const thousands = (value) => (Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "–");

function platformTable(results, platform) {
  const {baseline, comparisons} = results;
  const measurements = results.measurements.filter((m) => m.platform === platform && m.target !== "raw");

  if (!measurements.length) {
    return "";
  }

  const lines = [
    `### ${platform}`,
    "",
    "| Route | Target | req/s | p50 (ms) | p99 (ms) | CPU (µs/req) | Δ req/s | Δ CPU/req |",
    "| --- | --- | ---: | ---: | ---: | ---: | --- | --- |"
  ];

  for (const route of results.config.routes) {
    for (const m of measurements) {
      const rounds = m.routes[route];

      if (!rounds) {
        continue;
      }

      const comparison = comparisons.find((c) => c.target === m.target && c.platform === platform && c.route === route);
      const isBaseline = m.target === baseline;

      lines.push(
        [
          "",
          ROUTE_LABELS[route] || route,
          isBaseline ? `${m.target} (baseline)` : m.target,
          thousands(medianOf(rounds, "rps")),
          number(medianOf(rounds, "p50"), 1),
          number(medianOf(rounds, "p99"), 1),
          number(medianOf(rounds, "cpuPerRequest"), 1),
          isBaseline ? "" : formatGap(comparison?.metrics.rps),
          isBaseline ? "" : formatGap(comparison?.metrics.cpuPerRequest),
          ""
        ]
          .join(" | ")
          .trim()
      );
    }
  }

  return lines.join("\n");
}

function startupTable(results) {
  const lines = ["### Startup (cold start to the first 200)", "", "| Platform | Target | median (ms) | Δ |", "| --- | --- | ---: | --- |"];

  for (const m of results.measurements.filter((m) => m.target !== "raw" && m.startups.length)) {
    const comparison = results.comparisons.find((c) => c.target === m.target && c.platform === m.platform && c.route === "startup");
    const isBaseline = m.target === results.baseline;

    lines.push(
      `| ${m.platform} | ${isBaseline ? `${m.target} (baseline)` : m.target} | ${number(median(m.startups.filter(Number.isFinite)))} | ${
        isBaseline ? "" : formatGap(comparison?.metrics.startupMs)
      } |`
    );
  }

  return lines.length > 4 ? lines.join("\n") : "";
}

function rawTable(results) {
  const raws = results.measurements.filter((m) => m.target === "raw");

  if (!raws.length) {
    return "";
  }

  const lines = [
    "### Framework ceiling (GET /hello)",
    "",
    "Share of the requests/s of the same platform without Ts.ED.",
    "",
    "| Platform | raw req/s | Target | Ts.ED req/s | share |",
    "| --- | ---: | --- | ---: | ---: |"
  ];

  for (const raw of raws) {
    const rawRps = medianOf(raw.routes.hello, "rps");

    for (const m of results.measurements.filter((m) => m.platform === raw.platform && m.target !== "raw" && m.routes.hello)) {
      const rps = medianOf(m.routes.hello, "rps");
      lines.push(`| ${raw.platform} | ${thousands(rawRps)} | ${m.target} | ${thousands(rps)} | ${number((rps / rawRps) * 100)}% |`);
    }
  }

  return lines.join("\n");
}

function warnings(results) {
  const list = [];

  if (!results.environment.pinning) {
    list.push("CPU pinning is not available on this machine (`taskset` on Linux only): gaps under ~3% are not reliable.");
  }

  if (results.config.rounds < 3) {
    list.push(`Only ${results.config.rounds} round(s): the confidence intervals are very wide. Use at least 5 rounds to conclude.`);
  }

  for (const {target, platform} of results.unavailable) {
    list.push(`\`${target}\` does not publish the ${platform} platform: not available.`);
  }

  for (const {target, platform, errors} of results.failures) {
    list.push(`\`${target}/${platform}\` failed the response check and was not measured: ${errors[0]}`);
  }

  for (const m of results.measurements) {
    for (const [route, rounds] of Object.entries(m.routes)) {
      const errors = rounds.reduce((sum, r) => sum + (r?.errors || 0), 0);

      if (errors) {
        list.push(`\`${m.target}/${m.platform}\` ${ROUTE_LABELS[route] || route}: ${errors} failed requests during the measurement.`);
      }
    }
  }

  return list.map((warning) => `> ⚠️ ${warning}`).join("\n");
}

export function renderReport(results) {
  const {config, environment} = results;
  const header = [
    "## Ts.ED HTTP benchmark",
    "",
    `Baseline: \`${results.baseline}\` · targets: ${results.targets.map((t) => `\`${t.name}\``).join(", ")}`,
    "",
    `${config.rounds} rounds × ${config.duration} s (warmup ${config.warmup} s), ${config.connections} connections · ` +
      `Node ${environment.node}, ${environment.os}, ${environment.cpu} (${environment.cores} cores)` +
      `${environment.pinning ? `, server on core ${environment.pinning.server}` : ""} · seed ${config.seed}`,
    "",
    "Δ: geometric mean of the per-round ratios against the baseline, with its 95% confidence interval. " +
      "Positive means better (more requests/s, less CPU per request, faster startup). " +
      "Compare numbers within this report only: other runs ran on other machines."
  ].join("\n");

  return [header, warnings(results), ...config.platforms.map((p) => platformTable(results, p)), rawTable(results), startupTable(results)]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}
