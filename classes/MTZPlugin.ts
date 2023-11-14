import { MTZ } from "@Classes"
import { addCSS, subscribe, waitUntil } from "@Utils"
import { ContextMenuType } from "@Types"
import type { ContextMenu } from "@Helpers"

/**
 * Represents a plugin for the MTZ framework.
 */
export class MTZPlugin {

	public readonly name: string
	public readonly version: string
	public readonly author: string

	/**
	 * Creates a new instance of the MTZPlugin class.
	 * @param pkg The package.json file of the plugin.
	 */
	constructor(pkg: Promise<{ displayName?: string, name: string, version: string, author: string }>) {
		pkg.then(({ displayName, name, version, author }) => {
			this.name = displayName ?? name
			this.version = version
			this.author = author
			MTZ.addPlugin(this)
		})
	}

	/**
	 * Called when the plugin is initialized.
	 */
	init() { }

	/**
	 * Logs a message to the console.
	 * @param args The message to log.
	 */
	log() {
		var [text, style] = arguments[0].includes("%c") ? [...arguments] : [arguments[0], ""]
		console.info(`%c MTZ - ${this.name} %c ${text}`, "background: #171717; color: #ff4800; font-weight: bold", "", style)
	}

	/**
	 * Adds a CSS file to the document.
	 * @param url - The URL of the CSS file to add.
	 * @returns A Promise that resolves when the CSS file has been added.
	 */
	addCSS(url: string) {
		return addCSS(url)
	}

	/**
	 * Adds a listener function to the specified event.
	 * @param event - The name of the event to listen for.
	 * @param callback - The function to be called when the event is emitted.
	 * @param priority - (Optional) The priority of the listener. Listeners with higher priority will be called first.
	 * @returns A function that removes the listener when called.
	 */
	on(event: string, callback: Function, priority?: number): Function {
		return MTZ.on(event, callback, priority)
	}

	/**
	 * Adds a one-time listener function for the event named `event`.
	 * The next time `event` is triggered, this listener is removed and then invoked.
	 * @param event - The name of the event to listen for.
	 * @param callback - The function to be called when the event is emitted.
	 * @param priority - An optional parameter that specifies the priority of the event listener.
	 */
	once(event: string, callback: Function, priority?: number): void {
		MTZ.once(event, callback, priority)
	}

	/**
	 * Emits an event with the given name and arguments.
	 * @param event - The name of the event to emit.
	 * @param args - The arguments to pass to the event listeners.
	 * @returns The modified arguments after all event listeners have been called.
	 */
	emit(event: string, ...args: any[]) {
		return MTZ.emit(event, ...args)
	}

	/**
	 * Called when the screen changes.
	 * @param screen - The current screen.
	 * @param lastScreen - The previous screen.
	 */
	onScreen(screen: string, lastScreen: string) { }

	/**
	 * Called when the phase changes.
	 * @param phase - The current phase.
	 * @param lastPhase - The previous phase.
	 */
	onPhase(phase: string, lastPhase: string) { }

	/**
	 * Handles the context menu event.
	 * @param contextMenu The context menu object.
	 */
	onContextMenu(contextMenu: ContextMenu) { }
}