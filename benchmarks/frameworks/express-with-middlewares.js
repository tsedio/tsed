import express from "express";
import cors from "cors";
import dns_prefetch_control from "dns-prefetch-control";
import frameguard from "frameguard";
import hide_powered_by from "hide-powered-by";
import hsts from "hsts";
import ienoopen from "ienoopen";
import x_xss_protection from "x-xss-protection";

const app = express();

app.disable("etag");
app.disable("x-powered-by");

app.use(cors());
app.use(dns_prefetch_control());
app.use(frameguard());
app.use(hide_powered_by());
app.use(hsts());
app.use(ienoopen());
app.use(x_xss_protection());

app.get("/", function (req, res) {
  res.json({hello: "world"});
});

app.listen(3000);
