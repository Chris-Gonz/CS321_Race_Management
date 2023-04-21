import { Cars } from "@/components/data/Cars";
import StopWatch from "@/components/StopWatch";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;
export default function Home() {
	const [cars, setCars] = useState<typeof Cars>(Cars);
	const [isRunning1, setIsRunning1] = useState(false);
	const [isRunning2, setIsRunning2] = useState(false);
	const [time1, setTime1] = useState(0);
	const [time2, setTime2] = useState(0);

	// Use effect for setting the time
	useEffect(() => {
		socketInitializer();
	}, []);

	// Socket initializer
	const socketInitializer = async () => {
		await fetch("/api/socket");
		const socket = io();

		socket.on("connect", () => {
			setIsRunning1(localStorage.getItem("toggle1") === "true");
			setIsRunning2(localStorage.getItem("toggle2") === "true");
			setTime1(parseInt(localStorage.getItem("time1") || "0"));
			setTime2(parseInt(localStorage.getItem("time2") || "0"));
			console.log("connected");
		});
		socket.on("start-time", () => {
			setIsRunning1(true);
			setIsRunning2(true);
		});

		// Stop time given index
		socket.on("stop-time", (index) => {
			if (index == 0) {
				setIsRunning1(false);
			} else {
				setIsRunning2(false);
			}
			let newArr = [...Cars]; // copying the old datas array
			// a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
			newArr[index].LapTime = index == 0 ? time1 : time2; // replace e.target.value with whatever you want to change it to
			setCars(newArr);
		});

		// Clears time
		socket.on("clear-time", () => {
			setTime1(0);
			setTime2(0);
		});

		return null;
	};

	// For time interval 1
	useEffect(() => {
		let intervalId: any;
		if (isRunning1) {
			intervalId = setInterval(() => setTime1(time1 + 10), 10);
			localStorage.setItem("time1", time1.toString());
		}
		return () => clearInterval(intervalId);
	}, [isRunning1, time1]);

	// For time interval 2
	useEffect(() => {
		let intervalId: any;
		if (isRunning2) {
			intervalId = setInterval(() => setTime1(time2 + 10), 10);
			localStorage.setItem("time2", time2.toString());
		}
		return () => clearInterval(intervalId);
	}, [isRunning2, time2]);

	return (
		<div className="flex flex-col h-full bg-slate-900 gap-14">
			<div className="flex items-center justify-center w-full mt-5 ">
				<div className="relative font-mono text-center text-white text-7xl">
					🏁 Grand Prix 🏁
				</div>
				<Link href="/admin">
					<button className="absolute p-3 font-bold text-white bg-red-600 rounded-full right-4 top-4 hover:bg-red-700">
						Admin Panel
					</button>
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center h-full">
				{/* Video Feed Wrapper */}
				<div className="h-full w-[95%] flex justify-center items-center">
					{Cars.map((Cars, i) => (
						<div
							key={i}
							className="flex flex-col items-center justify-center w-full h-[40rem] gap-3 mx-9 bg-white rounded-3xl p-3"
						>
							<div className="flex gap-7 font-mono text-4xl font-black text-center text-black ">
								<div className="flex items-center">
									<div
										className={`h-[15px] w-[15px] ${
											Cars.connection
												? "bg-green-500"
												: "bg-red-500"
										} rounded-full`}
									/>
								</div>
								<span>{Cars.name}</span>
								<span className="text-red-400 text-4xl">
									<StopWatch time={i == 0 ? time1 : time2} />
								</span>
							</div>
							<div className="flex justify-center w-4/5 m-5 overflow-hidden bg-white border-1  rounded-3xl">
								{/*video feed iframe  src="https://localhost:8889/webcam"*/}
								<Image
									src={Cars.image}
									alt={"Live Feed Picture"}
									className="object-cover w-full h-auto"
									width={500}
									height={500}
								/>
							</div>
							<span className="text-3xl font-semibold text-black">
								{`Current Speed: ${Cars.currentSpeed} m/s`}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
