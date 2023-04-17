const express = require("express");
const app = express(),
	bodyParser = require("body-parser");
port = 3080;

app.use(bodyParser.json());

// obtain the data from request body and store it in racecar object
app.post("/addRacecar", (req, res) => {
	let racecar = req.body;
	console.log(racecar);
	res.send(racecar);
});

app.get("/", (req, res) => {
	res.send({ message: "Hello World!!!" });
});

app.listen(port, () => {
	console.log("Server listening on port " + port);
});