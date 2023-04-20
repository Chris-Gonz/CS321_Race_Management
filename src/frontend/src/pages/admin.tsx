import { Cars } from "@/components/data/Cars";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Admin() {
	// Use state for start/stop toggle button
	const [isRunning, setIsRunning] = useState(false);

	// Initialize socket
	useEffect(() => {
		socketInitializer();
	}, []);

	// Intialize socket handler
	const socketInitializer = async () => {
		await fetch("/api/socket");
		socket = io();
		socket.on("connect", () => {
			setIsRunning(localStorage.getItem("toggle") === "true");
		});

		socket.on("get-toggle", (toggle) => {
			setIsRunning(toggle);
		});

		return null;
	};

	return (
		<div className="flex w-full h-full bg-slate-900">
			<Link href="/">
				<button className="absolute p-3 font-bold text-white bg-red-600 rounded-full right-4 top-4 hover:bg-red-700">Back to Main</button>
			</Link>
			<div className="flex items-center justify-center w-full ">
				<div className="relative flex flex-col items-center gap-32 p-10 bg-gray-800 rounded-3xl">
					<span className="font-bold text-red-600 text-7xl">Admin Panel</span>
					<span className="absolute w-[70%] h-1 bg-gray-500 top-32" />
					<div className="flex flex-row gap-32">
						{Cars.map((Cars, i) => (
							<div key={i} className="p-12 bg-white rounded-3xl w-80 ">
								<div className="flex flex-col items-center text-3xl font-bold gap-x-5">
									<span>{Cars.name}</span>
									<span className={Cars.connection ? "text-green-600" : "text-red-600"}>
										{Cars.connection ? "Connected" : "Not Connected"}
									</span>
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-row gap-32 -my-36">
						{Cars.map((Cars, i) => (
							<div key={i} className="flex justify-center p-12 rounded-3xl w-80">
								<button key={i} className="font-black text-white ">
									<span
										className={Cars.connection ? "bg-red-600 rounded-full p-3 hover:bg-red-900" : "bg-gray-600 rounded-full p-3 "}
									>
										Disconnect
									</span>
								</button>
							</div>
						))}
					</div>

					<div className="flex w-1/2 justify-center items-center gap-5">
						<button
							className={`py-3 px-7 text-xl font-black text-white ${isRunning ? "bg-red-600" : "bg-green-800"}  rounded-2xl hover:${
								isRunning ? "bg-red-700" : "bg-green-900"
							}`}
							onClick={() => {
								localStorage.setItem("toggle", isRunning ? "false" : "true");
								socket.emit("update-toggle", isRunning ? false : true);
							}}
						>
							{isRunning ? "Stop" : "Start"}
						</button>
						<button
							className="py-3 px-7 text-xl font-black text-white bg-gray-400 rounded-2xl hover:bg-gray-500"
							onClick={() => {
								localStorage.setItem("toggle", "false");
								socket.emit("update-toggle", false);
								localStorage.setItem("time", "0");
								socket.emit("clear-time");
							}}
						>
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
