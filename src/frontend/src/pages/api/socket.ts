import { Car } from "@/interface/Car";
import { PageData } from "@/interface/PageData";
import { Server } from "socket.io";

// Need to store cars, time1, time2, running, running for index page
let pageData: PageData = {
	cars: [],
	time1: 0,
	time2: 0,
	running1: false,
	running2: false,
	start: false,
};

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

		// Updates any changes to pages state
		socket.on("update-data", (data: PageData) => {
			if (data != null) {
				if ("cars" in data) {
					pageData.cars = data.cars;
				}
				if ("running1" in data) {
					pageData.running1 = data.running1;
				}
				if ("running2" in data) {
					pageData.running2 = data.running2;
				}
				if ("start" in data) {
					pageData.start = data.start;
				}
				if ("time1" in data) {
					pageData.time1 = data.time1;
				}
				if ("time2" in data) {
					pageData.time2 = data.time2;
				}
			}
			io.emit("update-page", pageData);
		});

		// Send signal to index page to lap time given index
		socket.on("lap-time", (index) => {
			socket.broadcast.emit("lap-time", index);
		});

		// Update lap time
		socket.on("update-lap-time", (data) => {
			let car = pageData.cars[data.index];
			car.LapTime = data.time;
			if (data.index == 0) {
				pageData.time1 = data.time;
			} else if (data.index == 1) {
				pageData.time2 = data.time;
			}
		});

		// Clear timers
		socket.on("clear-times", () => {
			pageData.time1 = 0;
			pageData.time2 = 0;
			socket.broadcast.emit("clear-times");
		});

		// When updating page state
		socket.on("remove-racer", (index) => {
			pageData.cars.splice(index, 1);
			if (pageData.cars.length == 0) {
				pageData = {
					cars: [],
					time1: 0,
					time2: 0,
					running1: false,
					running2: false,
					start: false,
				};
			}
			io.emit("disconnect-racer", index + 1);
			io.emit("update-page", pageData);
		});

		/* Racer listeners */

		// Send setup signal to admin page to create new car
		socket.on("setup-racer", (data) => {
			// If there are already 2 cars, don't add another
			if (pageData.cars.length == 2) {
				console.log(
					"Max amount of racers reached for this race. Not adding new racer."
				);
				io.emit(
					"server-msg",
					"Max amount of racers reached for this race. Not adding your racer."
				);
				return;
			}
			console.log("Adding new racer");
			const newRacer: Car = {
				teamNum: data.number,
				name: data.name,
				link:
					pageData.cars.length == 0
						? "http://localhost:8889/cam1"
						: "http://localhost:8889/cam2", // link to video feed?
				throttleLevel: 0,
				connection: true,
				LapTime: 0,
			};
			io.emit("get-rtsp-server", pageData.cars.length == 0 ? 1 : 2);
			pageData.cars.push(newRacer);
			socket.broadcast.emit("update-page", pageData);
		});

		socket.on("send-throttle", (data) => {
			// need to know which car sends data throttle (-1 to 1 or -100 to 100)

			console.log(
				"Received throttle: " +
					data.throttle +
					" from team " +
					data.teamNum
			);
			if (pageData.cars[0].teamNum === data.teamNum) {
				pageData.cars[0].throttleLevel = data.throttle;
				io.emit("get-throttle", { index: 0, throttle: data.throttle });
			} else if (pageData.cars[1].teamNum === data.teamNum) {
				pageData.cars[1].throttleLevel = data.throttle;
				io.emit("get-throttle", { index: 1, throttle: data.throttle });
			} else {
				console.log("Invalid team number.");
				return;
			}
		});

		// need start/stop signal from us to them

		// need constant stats in json format, this should be constantly pushed to us.
	});

	res.end();
}
