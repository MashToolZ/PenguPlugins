class Kyasshu {

	#cache = {}

	#generic(key: string) {
		let parts = key.toString().split("."),
			last = parts.pop(),
			obj = this.#cache
		return [parts, last, obj]
	}

	push(key: string, ...values: any[]) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		target.push(...values)
	}

	pop(key: string) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		return target.pop()
	}

	shift(key: string) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		return target.shift()
	}

	unshift(key: string, ...values: any[]) {
		let target = this.get(key)
		if (!Array.isArray(target))
			return
		target.unshift(...values)
	}

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

	clear() {
		this.#cache = {}
	}
}

export default new Kyasshu()