const Koa = require("koa");
const {printMemory} = require("../printMemory");
const app = new Koa();

app.use(async (ctx) => {
  printMemory("nest");
  ctx.body = "Hello world!";
});

app.listen(process.env.PORT || 3000);
printMemory("nest");
