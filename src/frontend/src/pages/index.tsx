import ScoreBoard from "components/ScoreBoard";
import Link from "next/link";

export default function Home() {
	return (
		<div
			className="h-full  flex flex-col gap-14
		"
		>
			<div className="mt-5 w-full flex items-center justify-center ">
				<div className="font-mono text-center text-3xl text-white relative">
					🏁 Grand Prix 🏁
				</div>
				<Link href="/admin">
					<button className="absolute p-3 bg-red-600 rounded-full text-white right-4 top-4 font-bold hover:bg-red-700">
						Admin Panel
					</button>
				</Link>
			</div>
			<div className="h-full  flex flex-col justify-center items-center">
				{/* Video Feed Wrapper */}
				<div className="h-full w-[95%] flex justify-center items-center">
					<div className="h-full w-full flex flex-col items-center gap-3 mx-9">
						<div className="text-white text-center text-3xl font-mono font-black">
							🏎️ 1
						</div>
						<div className="bg-white w-full h-[95%] rounded-3xl"></div>
					</div>
					<div className="h-full w-full flex flex-col items-center gap-3 mx-9">
						<div className="text-white text-center text-3xl font-mono font-black">
							🏎️ 2
						</div>
						<div className="bg-white w-full h-[95%] rounded-3xl"></div>
					</div>
				</div>
				<span className="h-2 bg-gray-500 w-[70%] m-8" />
				{/* Scoreboard */}
				<div className="flex-col w-full h-full flex justify-center items-center gap-4">
					<div className="font-mono text-4xl text-white font-black ">
						Scoreboard
					</div>
					<div className="w-[70rem] h-full flex items-center justify-center bg-slate-50 flex-col gap-2 rounded-3xl">
						<ScoreBoard />
						<ScoreBoard />
					</div>
				</div>
			</div>
		</div>
	);
}
