import { Cars } from "@/components/data/Cars";
import { log } from "console";
import Link from "next/link";
import { useEffect } from "react";
import io from "socket.io-client";

let socket: undefined | typeof io;

export default function Admin({ isRunning, setIsRunning }: any) {
	// Initialize socket
	useEffect(() => {
		socketInitializer();
	}, []);

	const socketInitializer = async () => {
		await fetch("/api/socket");
		const socket = io();

		socket.on("connect", () => {
			console.log("connected");
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
									<div className="flex gap-10 mt-5 text-xl font-bold text-white">
										<button className="p-1 px-2 bg-red-600 rounded-lg hover:bg-red-700">C +0.5</button>
										<button className="p-1 px-2 bg-red-600 rounded-lg hover:bg-red-700">OOB +1</button>
										<button className="p-1 px-2 bg-red-600 rounded-lg hover:bg-red-700">RO +2</button>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-row gap-32 -my-36">
						{Cars.map((Cars, i) => (
							<div key={i} className="flex justify-center p-12 rounded-3xl w-80">
								<button key={i} className="font-black text-white ">
									<span
										className={Cars.connection ? "bg-red-700 rounded-full p-3 hover:bg-red-900" : "bg-gray-600 rounded-full p-3 "}
									>
										Disconnect
									</span>
								</button>
							</div>
						))}
					</div>
					<button className="py-3 text-3xl font-black text-white bg-transparent bg-green-800 rounded-full hover:bg-green-900 px-52">
						Start
					</button>
				</div>

				{/* <Link
          href={{
            query: isRunning,
          }}
        >
          <button
            className="py-2 px-9 bg-slate-500 "
            onClick={() => {
              setIsRunning(!isRunning);
            }}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
        </Link>
        <button className="py-2 px-9 bg-slate-500">Reset</button> */}
			</div>
		</div>
	);
}
