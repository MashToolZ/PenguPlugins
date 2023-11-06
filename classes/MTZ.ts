import MTZEvent from "./MTZEvent"
import MTZPlugin from "./MTZPlugin"
import { subscribe, waitUntil } from "./Utils"

type AudioChannel = "music" | "voice" | "sfx"

class MTZ {

	private plugins: MTZPlugin[] = []
	private phase: string = null

	#events: { [key: string]: MTZEvent[] } = {}
	#audio = null
	#data = {
		lastScreen: null,
		lastPhase: null
	}

	constructor(public readonly logging: boolean = false) {
		if (window.MTZ)
			return window.MTZ

		window.MTZ = this

		this.on("screen", this.#onScreen.bind(this))
		this.on("phase", this.#onPhase.bind(this))

		rcp.postInit("rcp-fe-audio", (api) => this.#audio = api.channels)

		waitUntil(() => this.isReady(), () => this.init())
	}

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

	log() {
		var [text, style] = arguments[0].includes("%c") ? [...arguments] : [arguments[0], ""]
		console.info(`%c MTZ %c ${text}`, "background: #171717; color: #ff4800; font-weight: bold", "", style)
	}

	init() {
		this.log(`Initialized`)
		subscribe("/lol-gameflow/v1/gameflow-phase", "phase", (message) => this.phase = JSON.parse(message.data)[2]?.data?.toUpperCase() || null)
		this.#update()
	}

	isReady() {
		return document.readyState === "complete"
			&& document.querySelector('link[rel="riot:plugins:websocket"]')
			&& this.#audio !== null
	}

	get screen() {
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

	playSound(sound: string, channel: AudioChannel) {
		this.#audio.get(channel).playSound(sound)
	}

	addPlugin(plugin: MTZPlugin) {
		this.plugins.push(plugin)
	}

	removePlugin(plugin: MTZPlugin) {
		this.plugins.splice(this.plugins.indexOf(plugin), 1)
	}

	getPlugin(name: string) {
		return this.plugins.find(plugin => plugin.name === name)
	}

	getPlugins() {
		return this.plugins
	}

	on(event: string, callback: Function, priority: Number = 0): Function {
		if (!this.#events[event])
			this.#events[event] = []
		const listener = new MTZEvent(event, callback, priority)
		this.#events[event].push(listener)
		return () => this.#events[event].splice(this.#events[event].indexOf(listener), 1)
	}

	once(event: string, callback: Function, priority: Number = 0): void {
		const remove = this.on(event, (...args) => {
			callback(...args)
			remove()
		}, priority)
	}

	emit(event: string, ...args: any[]) {
		if (!this.#events[event]) return false
		this.#events[event].sort((a, b) => b.priority - a.priority)
		this.#events[event].forEach(listener => {
			const result = listener.callback(...args)
			if (result) args = result
		})
		return args
	}

	#onScreen(screen: string, lastScreen: string) {
		this.plugins.forEach(plugin => plugin.onScreen && plugin.onScreen(screen, lastScreen))

		if (this.logging)
			this.log(`%cScreen: ${screen}`, "color: #ac4")
	}

	#onPhase(phase: string, lastPhase: string) {
		this.plugins.forEach(plugin => plugin.onPhase && plugin.onPhase(phase, lastPhase))
		if (this.logging)
			this.log(`%cPhase: ${phase}`, "color: #ca4")
	}
}

export default new MTZ(true)