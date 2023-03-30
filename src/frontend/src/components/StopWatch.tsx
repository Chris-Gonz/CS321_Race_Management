export default function StopWatch({ time }: any) {
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-white ">
        <p className="text-7xl ">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}:{milliseconds.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
