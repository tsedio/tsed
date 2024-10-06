import KoaRouter from "benchmarks/frameworks/koa-router.js";
import Koa from "koa";

const router = KoaRouter();

const app = new Koa();

router.get("/", async function (ctx) {
  ctx.body = {hello: "world"};
});

app.use(router.routes());
app.listen(3000);
