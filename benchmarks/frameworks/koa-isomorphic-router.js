import Koa from "koa";
import Router from "benchmarks/frameworks/koa-isomorphic-router.js";

const app = new Koa();
const router = new Router();

router.get("/", function (ctx) {
  ctx.body = {hello: "world"};
});

app.use(router.routes());
app.listen(3000);
