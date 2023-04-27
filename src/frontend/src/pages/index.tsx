import StopWatch from "@/components/StopWatch";
import { Car } from "@/interface/Car";
import { PageData } from "@/interface/PageData";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
	let socket: Socket;
	const [isLoading, setIsLoading] = useState(true);
	const [cars, setCars] = useState<Car[]>([]);
	const [isRunning1, setIsRunning1] = useState(false);
	const [isRunning2, setIsRunning2] = useState(false);
	const [time1, setTime1] = useState(0);
	const [time2, setTime2] = useState(0);
	const [throttle1, setThrottle1] = useState(0);
	const [throttle2, setThrottle2] = useState(0);
	const [recordLapTime, setRecordLapTime] = useState(false);
	// Initial render
	const initialRender = useRef(true);

	// Use effect for setting the time
	useEffect(() => {
		socketInitializer();
	}, []);

	// Socket initializer
	const socketInitializer = async () => {
		await fetch("/api/socket");
		const socket = io();

		socket.on("connect", () => {
			socket.emit("update-data");
			console.log("index page connected");
			setIsLoading(false);
		});

		socket.on("update-page", (data: PageData) => {
			setCars(data.cars);
			setIsRunning1(data.running1);
			setIsRunning2(data.running2);
			// If did not start yet, and time 1 is not 0, then set the time
			if (initialRender.current) {
				setTime1(data.time1);
				setTime2(data.time2);
				initialRender.current = false;
			}
		});

		socket.on("clear-times", () => {
			setTime1(0);
			setTime2(0);
		});

		socket.on("lap-time", (index) => {
			setRecordLapTime(true);
		});

		socket.on("get-throttle", (data) => {
			if (data.index == 0) {
				setThrottle1(data.throttle);
			} else if (data.index == 1) {
				setThrottle2(data.throttle);
			}
		});

		return null;
	};

	// For time interval 1
	useEffect(() => {
		let intervalId: any;

		if (isRunning1) {
			intervalId = setInterval(() => setTime1((time1) => time1 + 10), 10);
		}
		if (recordLapTime && !isRunning1) {
			console.log("time1: " + time1);
			setTime1(time1);
			io().emit("update-lap-time", { index: 0, time: time1 });
			setRecordLapTime(false);
		}
		return () => clearInterval(intervalId);
	}, [isRunning1, time1, recordLapTime]);

	//For time interval 2
	useEffect(() => {
		let intervalId: any;
		if (isRunning2) {
			intervalId = setInterval(() => setTime2(time2 + 10), 10);
		}
		if (recordLapTime && !isRunning2) {
			console.log("time2: " + time2);
			setTime2(time2);
			io().emit("update-lap-time", { index: 1, time: time2 });
			setRecordLapTime(false);
		}
		return () => clearInterval(intervalId);
	}, [isRunning2, time2, recordLapTime]);

	return !isLoading ? (
		<div className="flex flex-col h-full bg-neutral-900">
			<div className="flex items-center justify-center w-full mt-5 ">
				<div className="relative font-mono text-center text-white text-6xl italic flex gap-6">
					<Image
						src={"/pettit.jpg"}
						alt={"Pettit"}
						width={60}
						height={15}
						className="w-auto h-auto"
					></Image>{" "}
					Pettit Grand Prix
					<Image
						src={"/pettit.jpg"}
						alt={"Pettit"}
						width={60}
						height={15}
						className="w-auto h-auto"
					></Image>
				</div>
				<Link href="/admin">
					<button className="w-[120px] absolute p-2 font-bold text-white bg-red-600 rounded-xl right-4 top-4 hover:bg-red-700">
						Admin Panel
					</button>
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center h-full">
				<div className="h-full w-[95%] flex justify-center items-center gap-4">
					{cars.length != 0 ? (
						cars.map((car, i) => (
							<div
								key={i}
								className="flex flex-col items-center justify-center h-[1/2] rounded-[20px] bg-white pt-3 shadow-2xl shadow-white/25"
							>
								{/* Car Name and Connection Status with Time */}
								<div className="flex flex-col gap-5">
									<div className="flex gap-1 justify-between">
										<span className="w-[10px]"></span>
										<span
											className="text-6xl underline decoration-2 underline-offset-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
"
										>
											{car.name + " " + car.teamNum}
										</span>
										<div
											className={`h-[10px] w-[10px] ${
												car.connection
													? "bg-green-500"
													: "bg-red-500"
											} rounded-full`}
										/>
									</div>
								</div>
								{/* Video Feed Wrapper */}
								<div className="flex justify-center w-full mt-3 overflow-hidden bg-white">
									{/*video feed iframe  src="https://localhost:8889/webcam"*/}
									<iframe
										className="object-contain bg-black"
										src={car.link}
										width={700}
										height={450}
									/>
								</div>
								<span
									className={` ${
										time1 || time2 != 0
											? i == 0
												? isRunning1
													? "text-red-500"
													: "text-green-500"
												: isRunning2
												? "text-red-500"
												: "text-green-500"
											: "text-white"
									} text-5xl mt-2`}
								>
									<div className="w-full flex justify-center">
										<div className="text-center w-[15rem] bg-neutral-800  rounded-xl p-2 border-2 border-neutral-100">
											<StopWatch
												time={i == 0 ? time1 : time2}
											/>
										</div>
									</div>
								</span>
								<div
									className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)]
									text-2xl font-semibold text-black flex flex-row items-center justify-center gap-1
								"
								>
									<span>Throttle:</span>
									<span className="w-[10px] my-2 text-center">{`${
										i == 0 ? throttle1 : throttle2
									}%`}</span>
								</div>
							</div>
						))
					) : (
						<div
							className=" rounded-xl p-4 flex items-center justify-center flex-col gap-4
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
		</div>
	) : (
		<div className="h-full bg-neutral-900"></div>
	);
}
