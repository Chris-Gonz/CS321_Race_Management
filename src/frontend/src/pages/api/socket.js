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
		socket.on("update-toggle", (toggle) => {
			io.emit("get-toggle", toggle);
		});

		socket.on("clear-time", (time) => {
			io.emit("clear-time", time);
		});
	});

	res.end();
}
