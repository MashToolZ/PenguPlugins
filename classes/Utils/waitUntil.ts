declare global {
	interface Promise<T> {
		cancelled: boolean
		cancel: () => void
	}
}

Promise.prototype.cancelled = false
Promise.prototype.cancel = function () {
	this.cancelled = true
}

/**
 * Waits until a condition is met or a timeout occurs.
 * @param condition - The condition to check.
 * @param timeout - The maximum time to wait in milliseconds.
 * @param callback - An optional callback function to be called with the condition result.
 * @returns An object with a promise that resolves when the condition is met or rejects when a timeout occurs,
 * and a cancel function to cancel the waiting.
 */
export function waitUntil(condition: (() => any), timeout: number = Infinity, callback: ((conditionResult: any) => {}) | null = null) {

	const promise = new Promise<any>((resolve, reject) => {
		let startTime = performance.now()

		const checkCondition = () => {

			if (promise.cancelled) {
				reject("Cancelled")
				return
			}

			if (condition()) {
				if (callback) resolve(callback(condition()))
				else resolve(condition())
				return
			}

			const currentTime = performance.now()
			const elapsedTime = currentTime - startTime

			if (elapsedTime >= timeout) {
				reject("Timeout")
				return
			}

			requestAnimationFrame(checkCondition)
		}

		requestAnimationFrame(checkCondition)
	})

	return promise
}