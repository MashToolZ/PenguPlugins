/**
 * Delays the execution of the function by the specified amount of time.
 * @param ms - The amount of time to delay the execution in milliseconds.
 * @returns A promise that resolves after the specified amount of time has passed.
 */
export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}