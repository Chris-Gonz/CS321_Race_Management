import { Car } from "@/interface/Car";
import { Server } from "socket.io";

export default function SocketHandler(req: any, res: any) {
	if (res.socket.server.io) {
		res.end();
		return;
	}

	console.log("Setting up socket.io server");
	const io = new Server(res.socket.server);
	res.socket.server.io = io;

	io.on("connection", (socket) => {
		/* Page listeners */

		// Starts the timers on the index page
		socket.on("start", () => {
			io.emit("start-time");
		});

		// Cears the timers on the index page
		socket.on("clear", () => {
			io.emit("clear-time");
		});

		// When press Record lap button on admin, seend to index page to record lap time
		socket.on("record-lap", (index) => {
			io.emit("get-lap-time", index);
		});

		// Update cars list
		socket.on("update-cars", (cars) => {
			socket.broadcast.emit("get-cars", cars);
		});

		/* Racer listeners */

		// Send setup signal to admin page to create new car
		socket.on("setup-racer", (data) => {
			console.log("setting up new racer");
			const newRacer: Car = {
				carNum: data.number,
				name: data.name,
				link: "", // link to video feed?
				image: "/RaceTrack.jpg", // placeholder for webcam
				currentSpeed: 0,
				connection: true,
				LapTime: 0,
			};
			io.emit("add-racer", newRacer);
		});

		// need start/stop signal from us to them

		// need constant stats in json format, this should be constantly pushed to us.
	});

	res.end();
}
