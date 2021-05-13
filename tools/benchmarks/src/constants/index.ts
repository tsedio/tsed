import {dirname, join} from "path";
import {BenchmarkOptions} from "../interfaces/Benchmarks";

export const BENCHMARK_PATH = dirname(require.resolve("@tsed/benchmarks-apps"));
export const OUT_DIR_REPORTS = join(__dirname, "..", "..", "dist");

const LIBS_ENV = (process.env.LIBS || "").split(",").filter(Boolean);

export const BENCHMARK_OPTIONS: BenchmarkOptions = {
  baseDir: BENCHMARK_PATH,
  outDir: OUT_DIR_REPORTS,
  libs: [
    {value: "tsed", label: "Ts.ED Express"},
    {value: "tsed-koa", label: "Ts.ED Koa"},
    {value: "nest", label: "Nest-Express"},
    {value: "nest-fastify", label: "Nest-Fastify"},
    {value: "express", label: "Express"},
    {value: "express-router", label: "Express Router"},
    {value: "koa", label: "Koa"},
    {value: "fastify", label: "Fastify"}
  ].filter((lib) => {
    return LIBS_ENV.length ? LIBS_ENV.includes(lib.value) : true;
  }),
  compares: [
    ["tsed", "express"],
    ["tsed-koa", "koa"]
  ],
  port: 3010,
  threads: Number(process.env.BENCHMARKS_THREAD || 8),
  duration: String(process.env.BENCHMARKS_DURATION || "10s"),
  connections: Number(process.env.BENCHMARKS_CONNECTIONS || 1024)
};
