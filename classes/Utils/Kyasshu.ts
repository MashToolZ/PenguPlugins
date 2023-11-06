/**
 * A utility class for managing a cache of key-value pairs.
 */
export class Kyasshu {

	#cache = {}

	/**
	 * Splits a string key by dot notation and returns an array containing the parts, the last part, and the cache object.
	 * @param key - The string key to split.
	 * @returns An array containing the parts, the last part, and the cache object.
	 */
	#generic(key: string) {
		let parts = key.toString().split("."),
			last = parts.pop(),
			obj = this.#cache
		return [parts, last, obj]
	}

	/**
	 * Adds one or more values to an array stored under the given key.
	 * If the value stored under the key is not an array, nothing happens.
	 * @param key - The key to add the values to.
	 * @param values - The values to add to the array.
	 */
	push(key: string, ...values: any[]) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		target.push(...values)
	}

	/**
	 * Removes and returns the last element from an array stored under the given key.
	 * If the value stored under the key is not an array, nothing happens.
	 * @param key - The key to retrieve the array from.
	 * @returns The last element of the array, or undefined if the value stored under the key is not an array.
	 */
	pop(key: string) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		return target.pop()
	}

	/**
	 * Removes the first element from an array stored under the given key.
	 * 
	 * @param key - The key of the array to shift.
	 * @returns The removed element, or undefined if the target is not an array.
	 */
	shift(key: string) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		return target.shift()
	}

	/**
	 * Adds one or more elements to the beginning of an array stored under the given key.
	 * If the value stored under the key is not an array, this method does nothing.
	 * @param key - The key of the array to modify.
	 * @param values - The elements to add to the beginning of the array.
	 */
	unshift(key: string, ...values: any[]) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		target.unshift(...values)
	}

	/**
	 * Sets a value for a given key in the internal object.
	 * @param key - The key to set the value for.
	 * @param value - The value to set for the key.
	 */
	set(key: string, value: any) {
		let [parts, last, obj] = this.#generic(key)
		for (let part of parts) {
			if (!obj[part]) {
				obj[part] = {}
			}
			obj = obj[part]
		}
		obj[last] = value
	}

	/**
	 * Retrieves a value from the cache using the provided key.
	 * If no key is provided, returns the entire cache object.
	 * @param key The key to retrieve a value for. If null, returns the entire cache object.
	 * @returns The value associated with the provided key, or the entire cache object if no key is provided.
	 */
	get(key: string | null = null) {
		if (key === null)
			return this.#cache
		let [parts, last, obj] = this.#generic(key)
		for (let part of parts) {
			if (!obj[part]) {
				return undefined
			}
			obj = obj[part]
		}
		return obj[last]
	}

	/**
	 * Checks if the given key exists in the object.
	 * @param key - The key to check for.
	 * @returns Whether the key exists in the object or not.
	 */
	has(key: string) {
		let [parts, last, obj] = this.#generic(key)
		for (let part of parts) {
			if (!obj[part]) {
				return false
			}
			obj = obj[part]
		}
		return obj[last] !== undefined
	}

	/**
	 * Deletes the value associated with the given key from the internal object.
	 * @param key - The key to delete.
	 * @returns True if the key was found and deleted, false otherwise.
	 */
	delete(key: string) {
		let [parts, last, obj] = this.#generic(key)
		for (let part of parts) {
			if (!obj[part]) {
				return false
			}
			obj = obj[part]
		}
		delete obj[last]
	}

	/**
	 * Clears the cache.
	 */
	clear() {
		this.#cache = {}
	}
}