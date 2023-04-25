import StopWatch from "@/components/StopWatch";
import { Car } from "@/interface/Car";
import { PageData } from "@/interface/PageData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Admin() {
	const [isLoading, setIsLoading] = useState(true);
	// List of cars
	const [cars, setCars] = useState<Car[]>([]);

	// Use state for start/stop toggle button
	const [start, setStart] = useState(false);

	// Use stae for IsRunning1/2
	const [isRunning1, setIsRunning1] = useState(false);
	const [isRunning2, setIsRunning2] = useState(false);

	// Initial render
	const initialRender = useRef(true);

	// Initialize socket
	useEffect(() => {
		socketInitializer();
	}, []);

	// Intialize socket handler
	const socketInitializer = async () => {
		await fetch("/api/socket");
		socket = io();

		socket.on("connect", () => {
			socket.emit("update-data");
			console.log("admin page connected");
			setIsLoading(false);
		});

		// Update page data
		socket.on("update-page", (data: PageData) => {
			setCars(data.cars);
			setIsRunning1(data.running1);
			setIsRunning2(data.running2);
			setStart(data.start);
		});

		return null;
	};

	return !isLoading ? (
		<div className="flex w-full h-full bg-neutral-900">
			<Link href="/">
				<button className="w-[120px] absolute p-2 font-bold text-white bg-red-600 rounded-xl right-4 top-4 hover:bg-red-700">
					Main Panel
				</button>
			</Link>
			<div className="flex items-center justify-center w-full ">
				{cars.length != 0 ? (
					<div className="relative flex flex-col items-center gap-12 p-10 bg-neutral-800 rounded-3xl shadow-xl shadow-white/10">
						<span className="font-bold text-red-600 text-7xl">
							Admin Panel
						</span>
						<span className="absolute w-[70%] h-[0.2rem] bg-gray-600 top-32" />
						<div className="flex flex-row gap-5">
							{/* EACH CAR IN THE ADMIN PANEL CONNECTION */}
							{cars.map((car, i) => (
								<div className="flex flex-col gap-3 items-center">
									<div
										key={i}
										className="p-12 bg-white rounded-3xl w-80 shadow-2xl shadow-white/10"
									>
										<div className="flex flex-col items-center text-3xl gap-x-5 gap-y-2">
											<span className="font-bold">
												{car.name + " " + car.teamNum}
											</span>
											<span
												className={`font-bold
											${car.connection ? "text-green-500" : "text-red-500"} text-base`}
											>
												{car.connection
													? "Connected"
													: "Not Connected"}
											</span>
											<button
												className={`text-lg ${
													i == 0
														? !isRunning1
															? "bg-gray-400 pointer-events-none "
															: "bg-purple-500 hover:bg-purple-600"
														: !isRunning2
														? "bg-gray-400 pointer-events-none "
														: "bg-purple-500 hover:bg-purple-600"
												} rounded-full text-white p-2`}
												value={car.LapTime}
												onClick={() => {
													if (i === 0) {
														socket.emit(
															"update-data",
															{ running1: false }
														);
														if (!isRunning2) {
															socket.emit(
																"update-data",
																{ start: false }
															);
														}
													} else if (i === 1) {
														socket.emit(
															"update-data",
															{ running2: false }
														);
														if (!isRunning1) {
															socket.emit(
																"update-data",
																{ start: false }
															);
														}
													}
													socket.emit("lap-time", i);
												}}
											>
												Stop Time
											</button>
										</div>
									</div>
									<div>
										<button
											className="w-full p-2 bg-red-600 text-white text-lg text-center rounded-3xl hover:bg-red-700"
											onClick={() => {
												socket?.emit("remove-racer", i);
											}}
										>
											Disconnect
										</button>
									</div>
								</div>
							))}
						</div>
						<div className="flex w-1/2 justify-center items-center gap-5">
							<button
								className={`py-3 px-7 text-lg text-white ${
									start
										? "bg-gray-400 pointer-events-none"
										: "bg-green-800 hover:bg-green-900"
								}  rounded-2xl `}
								onClick={() => {
									socket.emit("update-data", {
										running1: true,
										running2: true,
										start: true,
									}); // Send data to server
								}}
							>
								Start
							</button>
							<button
								className="py-3 px-7 text-lg text-white bg-yellow-500 rounded-2xl hover:bg-yellow-600"
								onClick={() => {
									socket.emit("update-data", {
										running1: false,
										running2: false,
										start: false,
									}); // Send data to server
									socket.emit("clear-times");
								}}
							>
								Reset
							</button>
						</div>
					</div>
				) : (
					<div
						className="rounded-xl p-4 flex items-center justify-center flex-col gap-4
				"
					>
						<div className="text-2xl text-red-600 font-bold">
							No Cars Connected.{" "}
						</div>
						<div className="w-[16rem] rounded-md overflow-hidden">
							<img
								className="w-full h-auto
								object-contain"
								src="https://media.tenor.com/scX-kVPwUn8AAAAC/this-is-fine.gif"
							></img>
						</div>
					</div>
				)}
			</div>
		</div>
	) : (
		<div className="w-full h-full bg-neutral-900"></div>
	);
}
