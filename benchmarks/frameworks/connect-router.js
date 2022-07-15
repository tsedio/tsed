import connect from "benchmarks/frameworks/connect.js";
import router0 from "router";

const router = router0();

const app = connect();
router.get("/", function (req, res) {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({hello: "world"}));
});

app.use(router);
app.listen(3000);
