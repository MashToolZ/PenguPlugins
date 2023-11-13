/**
 * Waits until a condition is met or a timeout is reached.
 * @param condition The condition to check.
 * @param timeout The maximum amount of time to wait for the condition to be met, in milliseconds.
 * @param callback The function to call when the condition is met
 * @returns A Promise that resolves when the condition is met or rejects when the timeout is reached.
 */
export function waitUntil(condition = () => true, timeout = 1000, callback = conditionResult => { }): Promise<void> {
	return new Promise((resolve, reject) => {
		let interval = setInterval(() => {

			if (timeout <= 0) {
				clearInterval(interval)
				reject()
			}

			if (condition()) {
				clearInterval(interval)
				if (callback) resolve(callback(condition()))
				else resolve(condition())
			}

			timeout -= 10
		}, 10)
	})
}