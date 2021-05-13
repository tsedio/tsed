const express = require("express");
const app = express();
const router = express.Router();

router.get("/", async (req, res) => res.send("Hello world!"));

app.use("/", router);
app.listen(process.env.PORT || 3000);
