import MTZ from "./MTZ"
import { addCSS, subscribe, waitUntil } from "./Utils"

class MTZPlugin {

	constructor(public readonly name, public readonly version, public readonly author) {
		MTZ.addPlugin(this)
	}

	log() {
		var [text, style] = arguments[0].includes("%c") ? [...arguments] : [arguments[0], ""]
		console.info(`%c MTZ - ${this.name} %c ${text}`, "background: #171717; color: #ff4800; font-weight: bold", "", style)
	}

	async addCSS(url: string) {
		return addCSS(url)
	}

	on(event: string, callback: Function) {
		return MTZ.on(event, callback)
	}

	once(event: string, callback: Function) {
		return MTZ.once(event, callback)
	}

	emit(event: string, ...args: any[]) {
		return MTZ.emit(event, ...args)
	}

	onScreen(screen: string) { }

	onPhase(phase: string) { }
}

export default MTZPlugin