export default function Home() {
	return (
		<div
			className="h-full w-full flex flex-col gap-14
		"
		>
			<div className="h-[15%] w-full flex items-center justify-center">
				<div className="font-mono text-center text-6xl text-white">🏁 Racer Live Feed 🏁</div>
			</div>
			<div className="h-full w-full flex flex-col justify-center items-center">
				{/* Video Feed Wrapper */}
				<div className="h-full w-[75%] flex justify-center items-center">
					<div className="h-full w-full flex flex-col items-center gap-3">
						<div className="text-white text-center font-mono text-5xl">🏎️ 1</div>
						<div className="bg-white w-[80%] h-[95%]"></div>
					</div>
					<div className="h-full w-full flex flex-col items-center gap-3">
						<div className="text-white text-center text-5xl font-mono">🏎️ 2</div>
						<div className="bg-white w-[80%] h-[95%]"></div>
					</div>
				</div>

				{/* Scoreboard */}
				<div className="flex-col w-full h-full flex justify-center items-center gap-4">
					<div className="font-mono text-4xl text-white">Scoreboard</div>
					<div className="w-[70rem] h-[12rem] flex items-center justify-center bg-slate-50 flex-col gap-2">
						<div className="w-[97%] h-[40%] bg-gray-900"></div>
						<div className="w-[97%] h-[40%] bg-gray-900"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
