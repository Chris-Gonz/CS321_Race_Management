import { Cars } from "@/components/data/Cars";
import StopWatch from "@/components/StopWatch";
import { Car } from "@/interface/Cars";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Admin() {
	const [cars, setCars] = useState<Car[]>([]);

	// Use state for start/stop toggle button
	const [isStart, setStart] = useState(false);

	// Use state for finish1
	const [finish1, setFinish1] = useState(false);

	// Use state for finish2
	const [finish2, setFinish2] = useState(false);

	// Initialize socket
	useEffect(() => {
		socketInitializer();
	}, []);

	// Intialize socket handler
	const socketInitializer = async () => {
		await fetch("/api/socket");
		socket = io();

		socket.on("connect", () => {
			setStart(localStorage.getItem("start") === "true");
		});

		// Setup new racer
		socket.on("setup-racer", (data) => {
			createNewRacer(data);
		});

		return null;
	};

	// Create new racer
	const createNewRacer = (data: any) => {
		const newRacer: Car = {
			carNum: data.number,
			name: data.name,
			link: "", // link to video feed?
			image: "", // placeholder for webcam
			currentSpeed: 0,
			connection: true,
			LapTime: 0,
		};
		const updatedObjects = [...cars, newRacer];
		setCars(updatedObjects);
		socket.emit("update-cars", updatedObjects);
	};

	// Remove racer
	const removeRacer = (index: number) => {
		let indexToRemove = -1;
		for (let i = 0; i < cars.length; i++) {
			if (cars[i] === cars[index]) {
				indexToRemove = i;
				break;
			}
		}
		if (indexToRemove !== -1) {
			const updatedObjects = [...cars];
			updatedObjects.splice(indexToRemove, 1);
			setCars(updatedObjects);
			socket.emit("update-cars", updatedObjects);
			// Need to set local storage later somehow
		}
	};

	return (
		<div className="flex w-full h-full bg-slate-900">
			<Link href="/">
				<button className="absolute p-2 font-bold text-white bg-red-600 rounded-full right-4 top-4 hover:bg-red-700">Main</button>
			</Link>
			<div className="flex items-center justify-center w-full ">
				<div className="relative flex flex-col items-center gap-12 p-10 bg-gray-800 rounded-3xl">
					<span className="font-bold text-red-600 text-7xl">Admin Panel</span>
					<span className="absolute w-[70%] h-1 bg-gray-500 top-32" />
					<div className="flex flex-row gap-32">
						{/* EACH CAR IN THE ADMIN PANEL CONNECTION */}
						{cars.length != 0 ? (
							cars.map((car, i) => (
								// Div for each car in the admin panel
								<>
									<div className="flex flex-col gap-3 items-center">
										<div key={i} className="p-12 bg-white rounded-3xl w-80 ">
											<div className="flex flex-col items-center text-3xl font-bold gap-x-5 gap-y-2">
												<span>{car.name}</span>
												<span
													className={`
											${car.connection ? "text-green-500" : "text-red-500"} text-base`}
												>
													{car.connection ? "Connected" : "Not Connected"}
												</span>
												<span>
													<button
														className={`text-base ${
															i == 0
																? finish1
																	? "bg-gray-400 pointer-events-none "
																	: "bg-purple-500"
																: finish2
																? "bg-gray-400 pointer-events-none "
																: "bg-purple-500"
														} rounded-full text-white p-2`}
														value={car.LapTime}
														onClick={() => {
															if (i === 0) {
																localStorage.setItem("running1", "false");
																setFinish1(true);
															} else {
																localStorage.setItem("running2", "false");
																setFinish2(true);
															}
															socket.emit("record-lap", i);
														}}
													>
														Stop Time
													</button>
												</span>
											</div>
										</div>
										<div>
											<button
												className="w-full p-2 bg-red-500 text-white text-center rounded-3xl"
												onClick={() => {
													removeRacer(i);
												}}
											>
												Disconnect
											</button>
										</div>
									</div>
								</>
							))
						) : (
							<div
								className="bg-gray-600 rounded-xl p-3
							"
							>
								<div className="text-xl font-bold text-red-600">No Cars Connected :(</div>
							</div>
						)}
					</div>
					{cars.length != 0 ? (
						<div className="flex w-1/2 justify-center items-center gap-5">
							<button
								className={`py-3 px-7 text-xl font-black text-white ${
									isStart ? "bg-gray-400 pointer-events-none " : "bg-green-800"
								}  rounded-2xl`}
								onClick={() => {
									localStorage.setItem("running1", "true");
									localStorage.setItem("running2", "true");
									localStorage.setItem("start", "true");
									setStart(true);
									socket.emit("start");
								}}
							>
								Start
							</button>
							<button
								className="py-3 px-7 text-xl font-black text-white bg-yellow-500 rounded-2xl hover:bg-yellow-600"
								onClick={() => {
									localStorage.setItem("running1", "false");
									localStorage.setItem("running2", "false");
									localStorage.setItem("time1", "0");
									localStorage.setItem("time2", "0");
									localStorage.setItem("start", "false");
									setStart(false);
									setFinish1(false);
									setFinish2(false);
									socket.emit("clear");
								}}
							>
								Reset
							</button>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
