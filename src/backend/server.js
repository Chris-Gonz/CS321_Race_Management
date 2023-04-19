const express = require("express");
const WebSocketServer = require("ws");
const http = require("http");

// Port being used
port = 3080;

// Instance of express server
const app = express();

// Server for HTTP Requests
const server = http.createServer(app);

// Server for WebSocket, listens on same port as HTTP server
const wss = new WebSocketServer({ server });

// Start listening on port
app.listen(port, () => {
	console.log("Server listening on port " + port);
});

// obtain the data from request body and store it in racecar object
app.post("/addRacecar", (req, res) => {
	let racecar = req.body;
	console.log(racecar);
	res.send(racecar);
});

app.get("/", (req, res) => {
	res.send({ message: "Hello World!!!" });
});
