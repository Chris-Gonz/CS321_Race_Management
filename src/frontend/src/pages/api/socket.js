import { Server } from "socket.io";

export default function SocketHandler(req, res) {
	if (res.socket.server.io) {
		res.end();
		return;
	}

	console.log("Setting up socket.io server");
	const io = new Server(res.socket.server);
	res.socket.server.io = io;

	io.on("connection", (socket) => {
		// Page listeners
		socket.on("update-toggle", (toggle) => {
			io.emit("get-toggle", toggle);
		});

		socket.on("start", () => {
			io.emit("start-time");
		});

		socket.on("clear", () => {
			io.emit("clear-time");
		});

		socket.on("record-lap", (index) => {
			io.emit("get-lap-time", index);
		});

		socket.on("update-cars", (cars) => {
			io.emit("get-cars", cars);
		});

		// Racer listeners

		// Send setup signal to admin page to create new car
		socket.on("setup-racer", (data) => {
			console.log("setting up new racer");
			io.emit("get-setup", data);
		});

		// need start/stop signal from us to them

		// need constant stats in json format, this should be constantly pushed to us.
	});

	res.end();
}
