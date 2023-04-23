import { Car } from "@/interface/Car";
import { PageData } from "@/interface/PageData";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

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
			}
			console.log("pageData update: " + JSON.stringify(pageData));
			io.emit("update-page", pageData);
		});

		// Update time
		socket.on("update-time", (data) => {
			if ("time1" in data) {
				pageData.time1 = data.time1;
			}
			if ("time2" in data) {
				pageData.time2 = data.time2;
			}
		});

		// When updating page state
		socket.on("remove-racer", (index) => {
			pageData.cars.splice(index, 1);
			if (pageData.cars.length == 0) {
				pageData.running1 = false;
				pageData.running2 = false;
				pageData.start = false;
			}
			io.emit("update-page", pageData);
		});

		// When press Record lap button on admin, seend to index page to record lap time
		socket.on("record-lap", (index) => {
			pageData.cars[index].LapTime = index == 0 ? pageData.time1 : pageData.time2;
			console.log(`lap time for racer ${index}: ` + pageData.cars[index].LapTime);
			io.emit("update-page", pageData);
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
			pageData.cars.push(newRacer);
			socket.broadcast.emit("update-page", pageData);
		});

		// need start/stop signal from us to them

		// need constant stats in json format, this should be constantly pushed to us.
	});

	res.end();
}
