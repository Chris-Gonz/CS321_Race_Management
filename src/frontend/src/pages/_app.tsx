import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isRunning, setIsRunning] = useState(false);

  return <Component {...pageProps} isRunning={isRunning} setIsRunning={setIsRunning} />;
}
