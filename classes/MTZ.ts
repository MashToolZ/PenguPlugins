import MTZEvent from "./MTZEvent"
import MTZPlugin from "./MTZPlugin"
import { select, subscribe, waitUntil } from "./Utils"
import { AudioChannel } from "./Types"

/**
 * The MTZ class is the main class for the PenguPlugins library.
 * It provides functionality for interacting with the League of Legends client and plugins.
 */
class MTZ {

	private plugins: MTZPlugin[] = []
	private phase: string = null

	#events: { [key: string]: MTZEvent[] } = {}
	#audio = null
	#data = {
		lastScreen: null,
		lastPhase: null
	}

	/**
	 * Initializes the `MTZ` instance
	 */
	constructor(private readonly logging: boolean = false) {

		// Prevent creating multiple MTZ instances if one has already been created
		if (window.MTZ)
			return window.MTZ

		window.MTZ = this

		this.on("screen", this.#onScreen.bind(this))
		this.on("phase", this.#onPhase.bind(this))

		rcp.postInit("rcp-fe-audio", (api) => this.#audio = api.channels)

		waitUntil(() => this.isReady(), () => {
			this.log(`Initialized`)
			subscribe("/lol-gameflow/v1/gameflow-phase", "phase", (message) => this.phase = JSON.parse(message.data)[2]?.data?.toUpperCase() || null)
			this.#update()
		})
	}

	/**
	 * Checks if the document, WebSocket plugin, and audio object are all available.
	 * @returns {boolean} - Returns true if all three are available, otherwise returns false.
	 */
	private isReady() {
		return document.readyState === "complete"
			&& document.querySelector('link[rel="riot:plugins:websocket"]')
			&& this.#audio !== null
	}

	/**
	 * Logs a message to the console.
	 * @param args The message to log.
	 */
	private log() {
		var [text, style] = arguments[0].includes("%c") ? [...arguments] : [arguments[0], ""]
		console.info(`%c MTZ %c ${text}`, "background: #171717; color: #ff4800; font-weight: bold", "", style)
	}

	/**
	 * Updates the state of the MTZ instance.
	 * Emits "screen" and "phase" events if the screen or phase has changed.
	 * Calls the "update" method of each plugin.
	 * Requests a new animation frame to update the state again.
	 */
	#update() {

		if (this.#data.lastScreen !== this.screen) {
			this.emit("screen", this.screen, this.#data.lastScreen)
			this.#data.lastScreen = this.screen
		}

		if (this.#data.lastPhase !== this.phase) {
			this.emit("phase", this.phase, this.#data.lastPhase)
			this.#data.lastPhase = this.phase
		}

		this.plugins.forEach(plugin => plugin.update && plugin.update())

		requestAnimationFrame(() => this.#update())
	}

	/**
	 * Returns the current screen in the format of `MAIN/SUB` if both are available, otherwise just `MAIN`
	 * @returns {string}
	 */
	private get screen() {
		if (!document.body || document.querySelector(".lol-loading-screen-container"))
			return "LOADING"

		let main = document.querySelector(`.main-navigation-menu-item[active]`)
		let sub = document.querySelector("lol-uikit-navigation-item[active]")

		main = main ? main.offsetParent ? main.classList[1].split("_")[3].toUpperCase() : null : document.querySelector("section.rcp-fe-viewport-main > div.screen-root")?.getAttribute("data-screen-name")?.split("rcp-fe-lol-")[1]?.toUpperCase() ?? null
		sub = sub && sub.offsetParent ? sub.innerText.toUpperCase() : null

		if (!main && !sub)
			return "UNKNOWN"

		return `${main}${sub ? `/${sub}` : ""}`
	}

	/**
	 * Plays a sound on the specified audio channel.
	 * @param sound - The name of the sound to play.
	 * @param channel - The audio channel to play the sound on.
	 */
	playSound(sound: string, channel: AudioChannel) {
		this.#audio.get(channel).playSound(sound)
	}

	/**
	 * Adds a plugin to the list of plugins
	 * @param plugin - The plugin to add.
	 */
	addPlugin(plugin: MTZPlugin) {
		this.plugins.push(plugin)
	}

	/**
	 * Removes the plugin from the list of plugins
	 * @param plugin - The plugin to remove.
	 */
	private removePlugin(plugin: MTZPlugin) {
		this.plugins.splice(this.plugins.indexOf(plugin), 1)
	}

	/**
	 * Returns the plugin with the specified name.
	 * @param name - The name of the plugin to retrieve.
	 * @returns The plugin with the specified name, or undefined if no such plugin exists.
	 */
	getPlugin(name: string) {
		return this.plugins.find(plugin => plugin.name === name)
	}

	/**
	 * Returns an array of plugins.
	 * @returns {Array} An array of plugins.
	 */
	getPlugins() {
		return this.plugins
	}

	/**
	 * Adds a listener function to the specified event.
	 * @param event - The name of the event to listen for.
	 * @param callback - The function to be called when the event is emitted.
	 * @param priority - (Optional) The priority of the listener. Listeners with higher priority will be called first.
	 * @returns A function that removes the listener when called.
	 */
	on(event: string, callback: Function, priority: Number = 0): Function {
		if (!this.#events[event])
			this.#events[event] = []
		const listener = new MTZEvent(event, callback, priority)
		this.#events[event].push(listener)
		return () => this.#events[event].splice(this.#events[event].indexOf(listener), 1)
	}

	/**
	 * Adds a one-time listener function for the event named `event`.
	 * The next time `event` is triggered, this listener is removed and then invoked.
	 * @param event - A string representing the event type to listen for.
	 * @param callback - A function to be called when the event is triggered.
	 * @param priority - An optional parameter that specifies the priority of the event listener.
	 */
	once(event: string, callback: Function, priority: Number = 0): void {
		const remove = this.on(event, (...args) => {
			callback(...args)
			remove()
		}, priority)
	}

	/**
	 * Emits an event with the given name and arguments.
	 * @param event - The name of the event to emit.
	 * @param args - The arguments to pass to the event listeners.
	 * @returns The modified arguments after all event listeners have been called.
	 */
	private emit(event: string, ...args: any[]) {
		if (!this.#events[event]) return false
		this.#events[event].sort((a, b) => b.priority - a.priority)
		this.#events[event].forEach(listener => {
			const result = listener.callback(...args)
			if (result) args = result
		})
		return args
	}

	/**
	 * Calls the onScreen method of each plugin passing the current and last screen as parameters.
	 * @param screen - The current screen.
	 * @param lastScreen - The last screen.
	 */
	#onScreen(screen: string, lastScreen: string) {
		this.plugins.forEach(plugin => plugin.onScreen && plugin.onScreen(screen, lastScreen))

		if (this.logging)
			this.log(`%cScreen: ${screen}`, "color: #ac4")
	}

	/**
	 * Executes the onPhase method of each plugin and logs the phase if logging is enabled.
	 * @param phase - The current phase.
	 * @param lastPhase - The previous phase.
	 */
	#onPhase(phase: string, lastPhase: string) {
		this.plugins.forEach(plugin => plugin.onPhase && plugin.onPhase(phase, lastPhase))
		if (this.logging)
			this.log(`%cPhase: ${phase}`, "color: #ca4")
	}
}

export default new MTZ(false)