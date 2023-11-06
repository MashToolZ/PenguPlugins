const subscriptions: Map<string, Subscription> = new Map()

class Subscription {

	#callbacks: Map<string, Function> = new Map()

	constructor(endpoint: string, key: string, callback: Function) {
		this.endpoint = endpoint
		this.set(key, callback)

		const uri = document.querySelector('link[rel="riot:plugins:websocket"]').href
		this.ws = new WebSocket(uri, "wamp")

		this.ws.onopen = () => this.ws.send(JSON.stringify([5, "OnJsonApiEvent" + endpoint.replace(/\//g, "_")]))
		this.ws.onmessage = this.#onmessage.bind(this)

		return this
	}

	has(key: string): boolean {
		return this.#callbacks.has(key)
	}

	set(key: string, callback: Function): string {
		this.#callbacks.set(key, callback)
		return key
	}

	delete(key: string) {
		this.#callbacks.delete(key)
		if (this.#callbacks.size === 0) {
			this.ws.close()
			subscriptions.delete(this.endpoint)
		}
	}

	#onmessage(message: MessageEvent) {
		for (const callback of this.#callbacks.values())
			callback(message)
	}
}

function subscribe(endpoint: string, id: string, callback: Function): string | boolean {
	if (!subscriptions.has(endpoint)) {
		subscriptions.set(endpoint, new Subscription(endpoint, id, callback))
		return false
	}

	if (subscriptions.get(endpoint).has(id))
		return true

	return subscriptions.get(endpoint).set(id, callback)
}

function unsubscribe(endpoint: string, id: string) {
	if (!subscriptions.has(endpoint))
		return

	if (!subscriptions.get(endpoint).has(id))
		return

	subscriptions.get(endpoint).delete(id)
}

export { subscribe, unsubscribe }