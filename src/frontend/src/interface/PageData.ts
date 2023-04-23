import { Car } from "./Car";

export interface PageData {
	cars: Car[];
	time1: number;
	time2: number;
	running1: boolean;
	running2: boolean;
	// Need to store start state for admin page
	start: boolean;
}
