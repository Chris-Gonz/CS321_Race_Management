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

		socket.on("clear-time", (time) => {
			io.emit("clear-time", time);
		});

		// Racer listeners
		socket.on("message", (data) => {
			console.log(data);
			io.emit("message", "Hello client!");
		});

		socket.on("setup", (data) => {

		})

		// need start/stop signal from us to them

		// need constant stats in json format, this should be constantly pushed to us.
	});

	res.end();
}
