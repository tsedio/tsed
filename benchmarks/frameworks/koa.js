import Koa from "koa";

const app = new Koa();

app.use(async function (ctx) {
  ctx.body = {hello: "world"};
});

app.listen(3000);
