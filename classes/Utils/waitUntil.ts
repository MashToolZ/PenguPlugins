/**
 * Waits until a condition is met or a timeout is reached.
 * @param condition The condition to check.
 * @param timeout The maximum amount of time to wait for the condition to be met, in milliseconds.
 * @param callback The function to call when the condition is met
 * @returns A Promise that resolves when the condition is met or rejects when the timeout is reached.
 */
export function waitUntil(condition: (() => any), timeout = Infinity, callback: ((conditionResult: any) => {}) | null = null): Promise<any> {

	console.log("STARTED WAITUNTIL", condition, timeout, callback)

	return new Promise((resolve, reject) => {

		let startTime = performance.now()

		const checkCondition = () => {

			console.log("CHECKING CONDITION", condition.toString())

			if (condition()) {
				console.log("CONDITION MET")
				if (callback) resolve(callback(condition()))
				else resolve(condition())
				return
			}

			const currentTime = performance.now()
			const elapsedTime = currentTime - startTime

			if (elapsedTime >= timeout) {
				console.log("TIMEOUT REACHED", condition.toString(), elapsedTime, timeout)
				reject()
				return
			}

			requestAnimationFrame(checkCondition)
		}

		requestAnimationFrame(checkCondition)
	})
}