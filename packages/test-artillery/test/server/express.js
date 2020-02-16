const express = require("express");
const fs = require("fs");
const chalk = require("chalk");
const onFinished = require("on-finished");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const uuidv4 = require("uuid/v4");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);

// httpServer.keepAliveTimeout = 60000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression({}));
app.use(cors());
app.use(methodOverride());
app.use(bodyParser.urlencoded({
  extended: true
}));

function listen(http, port, address) {
  const promise = new Promise((resolve, reject) => {
    http.on("listening", resolve).on("error", reject);
  }).then(() => {
    const port = http.address().port;
    console.log("==>Port:", port);
  });

  http.listen(port, address);

  return promise;
}

const emitter = {
  async $emit(event, request, response) {
    // console.log("Event", event, request.id);
  }
};

app.use((request, response, next) => {
  const id = uuidv4().replace(/-/gi, "");
  request.id = id;
  request.ctx = {
    id
  };

  onFinished(response, (err, response) => {
    emitter.$emit("onResponse", request, response);
  });

  emitter.$emit("onRequest", request, response);

  next();
});
//
// app.get("/ctrl/:id", (req, res) => {
//   const {params: {id}} = req;
//
//   res.json({
//     id,
//     name: `${id} name`
//   });
// });
//
// app.post("/ctrl/:id", (req, res) => {
//   const {params: {id}, body: {name}} = req;
//
//   res.json({
//     id,
//     name
//   });
// });
//
// app.put("/ctrl/:id", (req, res) => {
//   const {params: {id}, body: {name}} = req;
//
//   res.json({
//     id,
//     name
//   });
// });
//
// app.delete("/ctrl/:id", (req, res) => {
//   const {params: {id}} = req;
//
//   res.json({
//     id,
//     name: `${id} name`
//   });
// });

listen(httpServer, 3000);

//------------------------------
const stats = [[], []];
let timestamp = 0;
const time = 1000;

const write = () => {
  const data = JSON.stringify(stats);
  fs.writeFile(__dirname + "/../../.tmp/stats.json", data, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("\nSaved stats to stats.json");
    }
    process.exit();
  });
};

let last = 0;
const onTick = () => {
  try {
    global.gc();
  } catch (e) {
    console.log("You must run program with 'node --expose-gc index.js' or 'npm start'");
    process.exit();
  }
  const heapUsed = process.memoryUsage().heapUsed;
  stats[0].push(timestamp);
  stats[1].push(heapUsed);
  timestamp += time;

  if (last) {
    console.log("Memory heap => ", heapUsed, heapUsed - last > 0 ? chalk.red("+") : chalk.green("-"));
  }
  last = heapUsed;
};
setInterval(onTick, time);
setTimeout(write, 80000);
