export default function StopWatch({ time }: any) {
	const minutes = Math.floor((time / 60000) % 60);
	const seconds = Math.floor((time / 1000) % 60);
	const milliseconds = (time / 10) % 100;

	return (
			<p>
				{minutes.toString().padStart(2, "0")}:
				{seconds.toString().padStart(2, "0")}.
				{milliseconds.toString().padStart(2, "0")}
			</p>
	);
}
