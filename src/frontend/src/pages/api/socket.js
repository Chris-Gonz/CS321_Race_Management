import { Server } from "socket.io";

export default function SocketHandler(req, res) {
	if (res.socket.server.io) {
		console.log("Already set up");
		res.end();
		return;
	}

	console.log("Setting up");
	const io = new Server(res.socket.server);
	res.socket.server.io = io;

	io.on("connection", (socket) => {
		console.log(socket.id);
		socket.on("update-toggle", (toggle) => {
			io.emit("get-toggle", toggle);
			console.log("from socket, " + toggle);
		});
	});

	res.end();
}
