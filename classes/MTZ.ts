import { MTZPlugin, Logger } from "@Classes"
import { select, subscribe, waitUntil } from "@Utils"
import { AudioChannel, MTZEvent } from "@Types"
import { ContextMenu } from "@Helpers"

declare global {
	interface Window {
		MTZ: MTZ
		Sweetalert2: any
	}
}

interface ToastFunction {
	(options: Object): void
	fire(options: Object): void
	mixin(options: Object): void
}

/**
 * The MTZ class is the main class for the PenguPlugins library.
 * It provides functionality for interacting with the League of Legends client and plugins.
 */
class MTZ {

	public Logger: Logger = new Logger(`%c MTZ `, "background: #171717; color: #ff4800; font-weight: bold")

	private plugins: MTZPlugin[] = []
	private phase: string | null = null
	private contextMenu = new ContextMenu()
	#Toast!: ToastFunction

	#events: { [key: string]: MTZEvent[] } = {}
	audio: any = null
	#data = {
		lastScreen: null,
		lastPhase: null
	} as { lastScreen: string | null, lastPhase: string | null }

	/**
	 * Initializes the `MTZ` instance
	 */
	constructor() {

		window.MTZ = this

		rcp.postInit("rcp-fe-audio", (api) => this.audio = api.channels)

		//@ts-ignore
		import("https://cdn.mashtoolz.xyz/lolclient/js/sweetalert2.js").then(() => {
			this.#Toast = window.Sweetalert2.mixin({
				toast: true,
				position: "top",
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				showCloseButton: true
			})
		})

		waitUntil(() => this.isReady()).then(() => {

			this.Logger.log("Initialized")

			document.addEventListener("contextmenu", event => this.contextMenu.target = event.target as HTMLElement, true)

			subscribe("/lol-gameflow/v1/gameflow-phase", "phase", (message: { data: string }) => this.phase = JSON.parse(message.data)[2]?.data?.toUpperCase() || null)

			this.getPlugins().forEach(plugin => !plugin.initialized && this.initPlugin(plugin))

			this.on("screen", this.#onScreen.bind(this))
			this.on("phase", this.#onPhase.bind(this))

			this.#update()
		})
	}

	/**
	 * Checks if the document, WebSocket plugin, and audio object are all available.
	 * @returns Returns true if all three are available, otherwise returns false.
	 */
	private isReady(): boolean {
		return (
			document.readyState === "complete" &&
			document.querySelector('link[rel="riot:plugins:websocket"]')
		) ? true : false
	}

	/**
	 * Initializes the MTZ plugin.
	 * @param plugin - The plugin to initialize.
	 */
	initPlugin(plugin: MTZPlugin) {
		plugin.initialized = true
		plugin.onInit()
		plugin.Logger.log("Initialized")
	}

	/**
	 * Adds a plugin to the list of plugins
	 * @param plugin - The plugin to add.
	 */
	addPlugin(plugin: MTZPlugin) {
		this.plugins.push(plugin)
		if (!plugin.initialized && this.isReady())
			this.initPlugin(plugin)
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
	getPlugins(): Array<MTZPlugin> {
		return this.plugins.sort((a, b) => {
			if (a.priority === b.priority)
				return a.name.localeCompare(b.name)
			return b.priority - a.priority
		})
	}

	/**
	 * Displays a toast notification using Sweetalert2.
	 * @param options - The options for the toast notification.
	 */
	Toast(options: Object) {
		this.#Toast.fire(options)
	}

	/**
	 * Updates the state of the MTZ instance.
	 * Calls the "update" method of each plugin.
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

		const contextMenu = select("lol-uikit-context-menu") as HTMLElement
		if (!contextMenu && this.contextMenu.open) {
			this.contextMenu.open = false
			this.#onContextMenu(null)
		}
		else if (contextMenu && !this.contextMenu.open) {
			this.contextMenu.open = true
			this.#onContextMenu(contextMenu)
		}

		this.plugins.forEach(plugin => plugin.update && plugin.update())

		requestAnimationFrame(() => this.#update())
	}

	/**
	 * Returns the current screen in the format of `MAIN/SUB` if both are available, otherwise just `MAIN`
	 * @returns {string}
	 */
	private get screen(): string {
		if (!document.body || document.querySelector(".lol-loading-screen-container"))
			return "LOADING"

		const element = document.querySelector(`.main-navigation-menu-item[active]`) as HTMLElement
		const mainScreen = element ? element.offsetParent ? element.classList[1].split("_")[3].toUpperCase() : null : document.querySelector("section.rcp-fe-viewport-main > div.screen-root")?.getAttribute("data-screen-name")?.split("rcp-fe-lol-")[1]?.toUpperCase() ?? null

		return mainScreen ?? "UNKNOWN"
	}

	/**
	 * Plays a sound on the specified audio channel.
	 * @param sound - The name of the sound to play.
	 * @param channel - The audio channel to play the sound on.
	 */
	playSound(sound: string, channel: AudioChannel) {
		if (!this.audio) return
		this.audio?.get(channel).playSound(sound)
	}

	/**
	 * Adds a listener function to the specified event.
	 * @param event - The name of the event to listen for.
	 * @param callback - The function to be called when the event is emitted.
	 * @param priority - (Optional) The priority of the listener. Listeners with higher priority will be called first.
	 * @returns A function that removes the listener when called.
	 */
	on(event: string, callback: Function, priority: number = 0): Function {
		if (!this.#events[event])
			this.#events[event] = []
		const listener = { event, callback, priority } as MTZEvent
		this.#events[event].push(listener)
		return () => this.#events[event].splice(this.#events[event].indexOf(listener), 1)
	}

	/**
	 * Adds a one-time listener function for the event named `event`.
	 * The next time `event` is triggered, this listener is removed and then invoked.
	 * @param event - The name of the event to listen for.
	 * @param callback - The function to be called when the event is emitted.
	 * @param priority - An optional parameter that specifies the priority of the event listener.
	 */
	once(event: string, callback: Function, priority: number = 0): void {
		const remove = this.on(event, (...args: any) => {
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
		this.Logger.info([`%cScreen: ${screen}`, "color: #ac4"])
		this.plugins.forEach(plugin => plugin.initialized && plugin.onScreen && plugin.onScreen(screen, lastScreen))
	}

	/**
	 * Executes the onPhase method of each plugin and logs the phase if logging is enabled.
	 * @param phase - The current phase.
	 * @param lastPhase - The previous phase.
	 */
		this.Logger.info([`%cPhase: ${phase}`, "color: #ca4"])
		this.plugins.forEach(plugin => plugin.initialized && plugin.onPhase && plugin.onPhase(phase, lastPhase))
	}

	/**
	 * Handles the context menu event.
	 * @param open - A boolean indicating whether the context menu is open or not.
	 * @param contextMenu - The HTML element representing the context menu.
	 * @param target - The HTML element that triggered the context menu event.
	 */
	#onContextMenu(contextMenu: HTMLElement | null) {

		this.contextMenu.menu = contextMenu ?? null
		this.contextMenu.optionsHolder = contextMenu?.shadowRoot?.querySelector("div.context-menu.context-menu-root") as HTMLElement ?? null
		const options = this.contextMenu.optionsHolder ? [...this.contextMenu.optionsHolder?.children] : [] as string[]

		if (this.contextMenu.target!.closest("lol-social-roster-group"))
			this.contextMenu.type = "Folder"

		if (this.contextMenu.target!.closest("lol-social-roster-member"))
			this.contextMenu.type = "Friend"

		this.Logger.info([`%cContextMenu: ${this.contextMenu.open ? "Opened" : "Closed"} (${this.contextMenu.type})`, "color: #4ac"])

		this.plugins.forEach(plugin => plugin.initialized && plugin.onContextMenu && plugin.onContextMenu(this.contextMenu))

		if (!options.length) {
			this.contextMenu.type = null
			this.contextMenu.target = null
		}
	}
}

const instance = window.MTZ || new MTZ(false)
export { instance as MTZ }