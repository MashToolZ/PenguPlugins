/**
 * Map of subscriptions.
 * @type {Map<string, Subscription>}
 */
const subscriptions: Map<string, Subscription> = new Map()

/**
 * Represents a subscription to a WebSocket endpoint.
 */
class Subscription {

	private readonly endpoint: string
	private readonly ws: WebSocket

	/**
	 * A map of subscription callbacks.
	 * The keys are strings and the values are functions.
	 */
	#callbacks: Map<string, Function> = new Map()

	/**
	 * Creates a new Subscription instance.
	 * @constructor
	 * @param {string} endpoint - The endpoint to subscribe to.
	 * @param {string} key - The key to use for the subscription.
	 * @param {Function} callback - The callback function to execute when a message is received.
	 */
	constructor(endpoint: string, key: string, callback: Function) {
		this.endpoint = endpoint
		this.set(key, callback)

		const uri = (document.querySelector('link[rel="riot:plugins:websocket"]') as HTMLLinkElement).href
		this.ws = new WebSocket(uri, "wamp")

		this.ws.onopen = () => this.ws.send(JSON.stringify([5, "OnJsonApiEvent" + endpoint.replace(/\//g, "_")]))
		this.ws.onmessage = this.#onmessage.bind(this)

		return this
	}

	/**
	 * Checks if a callback with the given key exists in the subscription.
	 * @param key - The key of the callback to check for.
	 * @returns True if a callback with the given key exists, false otherwise.
	 */
	has(key: string): boolean {
		return this.#callbacks.has(key)
	}

	/**
	 * Adds a new callback function to the subscription list with the given key.
	 * @param key - The key to identify the callback function.
	 * @param callback - The callback function to be added.
	 * @returns The key used to identify the callback function.
	 */
	set(key: string, callback: Function): string {
		this.#callbacks.set(key, callback)
		return key
	}

	/**
	 * Removes the callback associated with the given key from the subscription.
	 * If there are no more callbacks associated with the subscription, the WebSocket connection is closed and the subscription is removed from the global subscriptions map.
	 * @param key - The key associated with the callback to remove.
	 */
	delete(key: string) {
		this.#callbacks.delete(key)
		if (this.#callbacks.size === 0) {
			this.ws.close()
			subscriptions.delete(this.endpoint)
		}
	}

	/**
	 * Handles incoming messages by invoking all registered callbacks.
	 * @param message - The incoming message.
	 */
	#onmessage(message: MessageEvent) {
		for (const callback of this.#callbacks.values())
			callback(message)
	}
}

/**
 * Subscribes to an endpoint with a given id and callback function.
 * @param endpoint - The endpoint to subscribe to.
 * @param id - The id of the subscription.
 * @param callback - The callback function to be called when a message is received on the endpoint.
 * @returns False if the endpoint is not yet subscribed to, true if the subscription already exists, or the callback function if a new subscription is created.
 */
function subscribe(endpoint: string, id: string, callback: Function): string | boolean {
	if (!subscriptions.has(endpoint)) {
		subscriptions.set(endpoint, new Subscription(endpoint, id, callback))
		return false
	}

	if (subscriptions.get(endpoint)!.has(id))
		return true

	return subscriptions.get(endpoint)!.set(id, callback)
}

/**
 * Removes the subscription with the given id from the endpoint's subscriptions.
 * @param endpoint - The endpoint to remove the subscription from.
 * @param id - The id of the subscription to remove.
 */
function unsubscribe(endpoint: string, id: string) {
	if (!subscriptions.has(endpoint))
		return

	if (!subscriptions.get(endpoint)!.has(id))
		return

	subscriptions.get(endpoint)!.delete(id)
}

export { subscribe, unsubscribe }