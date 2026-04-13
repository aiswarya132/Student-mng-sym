const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(
    cors({
        origin: clientOrigin,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/students", require("./server/routes/students"));

const clientDist = path.join(__dirname, "client", "dist");
const clientIndex = path.join(clientDist, "index.html");
if (fs.existsSync(clientIndex)) {
    app.use(express.static(clientDist));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(clientIndex);
    });
}

app.listen(port, () => {
    console.log("Listening on port " + port);
});
