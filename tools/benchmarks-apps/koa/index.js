const Koa = require("koa");
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Hello world!";
});

app.listen(process.env.PORT || 3000);
