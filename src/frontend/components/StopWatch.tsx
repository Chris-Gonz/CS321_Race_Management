import { useState, useEffect } from "react";

export default function StopWatch() {
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	useEffect(() => {
		let intervalId: any;
		if (isRunning) {
			intervalId = setInterval(() => setTime(time + 1), 10);
		}
		return () => clearInterval(intervalId);
	}, [isRunning, time]);
	const hours = Math.floor(time / 360000);
	const minutes = Math.floor((time % 360000) / 6000);
	const seconds = Math.floor((time % 6000) / 100);
	const milliseconds = time % 100;

	const startAndStop = () => {
		setIsRunning(!isRunning);
	};
	const reset = () => {
		setTime(0);
	};

	return (
		<div className="flex flex-col h-full justify-center items-center">
			<div className="text-white ">
				<p className="text-7xl w-96 ">
					{hours}:{minutes.toString().padStart(2, "0")}:
					{seconds.toString().padStart(2, "0")}:
					{milliseconds.toString().padStart(2, "0")}
				</p>
				<div className="gap-9 flex flex-row justify-between my-5">
					<button className="py-2 px-9 bg-slate-500 justify-start" onClick={startAndStop}>
						{isRunning ? "Stop" : "Start"}
					</button>
					<button className="py-2 px-9 bg-slate-500 justify-end" onClick={reset}>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}
