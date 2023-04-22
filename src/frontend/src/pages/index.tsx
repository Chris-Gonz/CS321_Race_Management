import { Cars } from "@/components/data/Cars";
import StopWatch from "@/components/StopWatch";
import { Car } from "@/interface/Cars";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;
export default function Home() {
	const [cars, setCars] = useState<Car[]>([]);
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
			setIsRunning1(localStorage.getItem("running1") === "true");
			setIsRunning2(localStorage.getItem("running2") === "true");
			setTime1(parseInt(localStorage.getItem("time1") || "0"));
			setTime2(parseInt(localStorage.getItem("time2") || "0"));
			console.log("connected");
		});
		socket.on("start-time", () => {
			setIsRunning1(true);
			setIsRunning2(true);
		});

		// Stop one of the racer's time given index
		socket.on("get-lap-time", (index) => {
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
			setIsRunning1(false);
			setIsRunning2(false);
			setTime1(0);
			setTime2(0);
		});

		// Gets cars data
		socket.on("get-cars", (data) => {
			setCars(data);
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

	//For time interval 2
	useEffect(() => {
		let intervalId: any;
		if (isRunning2) {
			intervalId = setInterval(() => setTime2(time2 + 10), 10);
			localStorage.setItem("time2", time2.toString());
		}
		return () => clearInterval(intervalId);
	}, [isRunning2, time2]);

	return (
		<div className="flex flex-col h-full bg-slate-900 gap-14">
			<div className="flex items-center justify-center w-full mt-5 ">
				<div className="relative font-mono text-center text-white text-7xl italic flex gap-5">
					<Image src={"/pettit.jpg"} alt={"Pettit"} width={60} height={15}></Image> Pettit Grand Prix
					<Image src={"/pettit.jpg"} alt={"Pettit"} width={60} height={15}></Image>
				</div>
				<Link href="/admin">
					<button className="absolute p-2 font-bold text-white bg-red-600 rounded-full right-4 top-4 hover:bg-red-700">Admin Panel</button>
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center h-full">
				<div className="h-full w-[95%] flex justify-center items-center">
					{cars.length != 0 ? (
						cars.map((car, i) => (
							<div key={i} className="flex flex-col items-center justify-center h-[40rem] gap-3 mx-9 bg-white rounded-3xl p-3">
								{/* Car Name and Connection Status with Time */}
								<div className="flex flex-col gap-3">
									<div className="flex gap-1 text-4xl justify-between">
										<span className="w-[10px]"></span>
										<span>{car.name}</span>
										<div className={`h-[10px] w-[10px] ${car.connection ? "bg-green-500" : "bg-red-500"} rounded-full`} />
									</div>
									<span
										className={`${
											time1 || time2 != 0
												? i == 0
													? isRunning1
														? "text-red-500"
														: "text-green-500"
													: isRunning2
													? "text-red-500"
													: "text-green-500"
												: "text-black"
										} text-5xl`}
									>
										<div className="w-full bg-gray-100  rounded-xl p-2 border-2 border-black">
											<StopWatch time={i == 0 ? time1 : time2} />
										</div>
									</span>
								</div>
								{/* Video Feed Wrapper */}
								<div className="flex justify-center w-4/5 m-5 overflow-hidden bg-white border-1  rounded-3xl">
									{/*video feed iframe  src="https://localhost:8889/webcam"*/}
									<Image src={car.image} alt={"Live Feed Picture"} className="object-cover" width={1000} height={700} />
								</div>
								<span className="text-3xl font-semibold text-black">{`Current Speed: ${car.currentSpeed} m/s`}</span>
							</div>
						))
					) : (
						<div
							className="bg-gray-800 rounded-xl p-4
					"
						>
							<div className="text-5xl font-bold text-red-600">No Cars Connected :(</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
