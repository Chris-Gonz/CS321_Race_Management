const { Server } = require("socket.io");

export default function handler(req: any, res: any) {
	// It means that socket server was already initialised
	if (res.socket.server.io) {
		console.log("Already set up");
	} else {
		console.log("Setting up socket");
		const io = new Server(res.socket.server);
		res.socket.server.io = io;
	}
	res.end();
}
