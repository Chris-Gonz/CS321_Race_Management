import { Cars } from "@/components/data/Cars";
import StopWatch from "@/components/StopWatch";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;
export default function Home() {
	const [isRunning, setIsRunning] = useState(false);

	const [time, setTime] = useState(0);

	// Use effect for setting the time
	useEffect(() => {
		socketInitializer();
	}, []);

	// Socket initializer
	const socketInitializer = async () => {
		await fetch("/api/socket");
		const socket = io();

		socket.on("connect", () => {
			setIsRunning(localStorage.getItem("toggle") === "true");
			setTime(parseInt(localStorage.getItem("time") || "0"));
			console.log("connected");
		});
		socket.on("get-toggle", (toggle) => {
			setIsRunning(toggle);
		});
		socket.on("clear-time", () => {
			setTime(0);
		});
		return null;
	};

	// For time interval
	useEffect(() => {
		let intervalId: any;
		if (isRunning) {
			intervalId = setInterval(() => setTime(time + 10), 10);
			localStorage.setItem("time", time.toString());
		}
		return () => clearInterval(intervalId);
	}, [isRunning, time]);

	return (
		<div className="flex flex-col h-full bg-slate-900 gap-14">
			<div className="flex items-center justify-center w-full mt-5 ">
				<div className="relative font-mono text-center text-white text-7xl">🏁 Grand Prix 🏁</div>
				<Link href="/admin">
					<button className="absolute p-3 font-bold text-white bg-red-600 rounded-full right-4 top-4 hover:bg-red-700">Admin Panel</button>
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center h-full">
				{/* Video Feed Wrapper */}
				<div className="h-full w-[95%] flex justify-center items-center">
					{Cars.map((Cars, i) => (
						<div key={i} className="flex flex-col items-center w-full h-full gap-3 mx-9">
							<div className="flex gap-2 font-mono text-5xl font-black text-center text-white">
								<span>{Cars.name}</span>
								<span>{Cars.icons}</span>
							</div>
							<div className="flex justify-center w-4/5 m-5 overflow-hidden bg-white border-2 h-3/5 rounded-3xl">
								<Image src={Cars.image} alt={"Live Feed Picture"} className="object-cover w-full h-auto" width={500} height={500} />
							</div>
							<span className="text-3xl font-bold text-white">
								<span className="text-red-400">{Cars.currentSpeed}</span> m/s
							</span>
						</div>
					))}
				</div>
				<span className="h-2 bg-gray-500 w-[70%] " />

				{/* Scoreboard */}
				<div className="flex flex-col items-center justify-center w-full h-full gap-3">
					<div className="font-mono text-4xl font-black text-white">Running Time</div>
					<StopWatch time={time} />
					<div className="absolute flex flex-row justify-between w-3/5">
						{Cars.map((Cars, i) => (
							<div key={i} className="flex flex-row justify-center p-8 bg-gray-800 rounded-3xl">
								<div className="flex flex-col items-center gap-5 text-4xl text-white">
									<span className="text-5xl font-bold">{Cars.name}</span>
									<span className="text-red-400">00:32:23</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
