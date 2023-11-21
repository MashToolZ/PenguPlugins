import { MTZ } from "@Classes"
import { addCSS } from "@Utils"
import { Logger } from "@Helpers"
import type { ContextMenu } from "@Helpers"
import { GameFlowPhase, GameScreen } from "@Types"

/**
 * Represents a plugin for the MTZ framework.
 */
export class MTZPlugin {

	public Logger!: Logger

	public name!: string
	public version!: string
	public author!: string
	public priority: number = 0

	public initialized: boolean = false

	/**
	 * Creates a new instance of the MTZPlugin class.
	 * @param pkg The package.json file of the plugin.
	 */
	constructor(pkg: Promise<{ displayName?: string, name: string, priority?: number, version: string, author: string }>) {
		pkg.then(({ displayName, name, priority, version, author }) => {
			this.name = displayName ?? name
			this.version = version
			this.author = author
			this.priority = priority ?? 0

			this.Logger = new Logger(`%c MTZ - ${this.name} `, "background: #171717; color: #ff4800; font-weight: bold")

			MTZ.addPlugin(this)
		})
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
	 * Called when the plugin is initialized.
	 */
	onInit() { }

	/**
	 * Called when the screen changes.
	 * @param screen - The current screen.
	 * @param lastScreen - The previous screen.
	 */
	// @ts-ignore
	onScreen(screen: GameScreen, lastScreen: GameScreen) { }

	/**
	 * Called when the phase changes.
	 * @param phase - The current phase.
	 * @param lastPhase - The previous phase.
	 */
	// @ts-ignore
	onPhase(phase: GameFlowPhase, lastPhase: GameFlowPhase) { }

	/**
	 * Handles the context menu event.
	 * @param contextMenu The context menu object.
	 */
	// @ts-ignore
	onContextMenu(contextMenu: ContextMenu) { }

	/**
	 * Emitted whenever the MTZ instance updates
	 */
	update() { }
}