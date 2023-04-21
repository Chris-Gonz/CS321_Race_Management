import { Cars } from "@/components/data/Cars";
import StopWatch from "@/components/StopWatch";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Admin() {
	const [cars, setCars] = useState<typeof Cars>(Cars);

	// Change time Speed
	const updateFieldChanged = (index: number) => {
		socket.emit("record-lap", index);
	};

	// Use state for start/stop toggle button
	const [isStart, setStart] = useState(false);

	// Initialize socket
	useEffect(() => {
		socketInitializer();
	}, []);

	// Intialize socket handler
	const socketInitializer = async () => {
		await fetch("/api/socket");
		socket = io();
		socket.on("connect", () => {
			setStart(localStorage.getItem("toggle") === "true");
		});

		socket.on("get-toggle", (toggle) => {
			setStart(toggle);
		});

		return null;
	};

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
		}
	};
	return (
		<div className="flex w-full h-full bg-slate-900">
			<Link href="/">
				<button className="absolute p-3 font-bold text-white bg-red-600 rounded-full right-4 top-4 hover:bg-red-700">
					Back to Main
				</button>
			</Link>
			<div className="flex items-center justify-center w-full ">
				<div className="relative flex flex-col items-center gap-12 p-10 bg-gray-800 rounded-3xl">
					<span className="font-bold text-red-600 text-7xl">
						Admin Panel
					</span>
					<span className="absolute w-[70%] h-1 bg-gray-500 top-32" />
					<div className="flex flex-row gap-32">
						{/* EACH CAR IN THE ADMIN PANEL CONNECTION */}
						{cars.map((car, i) => (
							// Div for each car in the admin panel
							<>
								<div className="flex flex-col gap-3 items-center">
									<div
										key={i}
										className="p-12 bg-white rounded-3xl w-80 "
									>
										<div className="flex flex-col items-center text-3xl font-bold gap-x-5 gap-y-2">
											<span>{car.name}</span>
											<span
												className={`
											${car.connection ? "text-green-500" : "text-red-500"} text-base`}
											>
												{car.connection
													? "Connected"
													: "Not Connected"}
											</span>
											<span>
												<button
													className="text-base bg-gray-600 rounded-full text-white p-2"
													value={car.LapTime}
													onClick={() =>
														updateFieldChanged(i)
													}
												>
													Lap Time
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
						))}
					</div>
					<div className="flex w-1/2 justify-center items-center gap-5">
						<button
							className={`py-3 px-7 text-xl font-black text-white ${
								isStart
									? "bg-gray-400 pointer-events-none "
									: "bg-green-800"
							}  rounded-2xl`}
							onClick={() => {
								localStorage.setItem("toggle1", "true");
								localStorage.setItem("toggle2", "true");
								setStart(true);
								socket.emit("start");
							}}
						>
							Start
						</button>
						<button
							className="py-3 px-7 text-xl font-black text-white bg-yellow-500 rounded-2xl hover:bg-yellow-600"
							onClick={() => {
								localStorage.setItem("toggle1", "false");
								localStorage.setItem("toggle2", "false");
								setStart(false);
								socket.emit("clear");
							}}
						>
							Reset
						</button>
					</div>
					<div className="flex flex-col items-center justify-center w-full  text-2xl text-white">
						Running Time
						<span className="text-red-500 font-black">
							<StopWatch time={5000} />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
