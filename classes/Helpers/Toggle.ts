import { MTZ } from "@Classes"
import { Tooltip } from "@Helpers"
import { select, sleep } from "@Utils"

export interface ToggleOptions {
	parent: string
	name: string
	className: string
	tooltip: string
	disabled: () => boolean
	onEnable: Function
	onDisable: Function
	onToggle: Function
}

/**
 * A class representing a toggle button.
 */
export class Toggle {

	public readonly button: HTMLElement | null = null
	private readonly parent: string
	private readonly name: string
	private readonly className: string
	private readonly disabled: Function
	private readonly tooltip: string
	private readonly onEnable: Function
	private readonly onDisable: Function
	private readonly onToggle: Function

	private toggleSFX = "/fe/lol-parties/sfx-parties-button-toggle.ogg"

	constructor({
		parent,
		name,
		className,
		disabled = () => false,
		tooltip = "",
		onEnable = () => { },
		onDisable = () => { },
		onToggle = () => { }
	}: ToggleOptions) {

		if (!parent)
			throw new Error("Toggle: No parent specified")

		if (!name)
			throw new Error("Toggle: No name specified")

		if (!className)
			throw new Error("Toggle: No className specified")

		this.parent = parent
		this.name = name
		this.className = className
		this.disabled = disabled
		this.tooltip = tooltip
		this.onEnable = onEnable.bind(this)
		this.onDisable = onDisable.bind(this)
		this.onToggle = onToggle.bind(this)

		this.init()

		return this.button
	}

	/**
	 * Initializes the toggle button and adds it to the parent element.
	 * If the button already exists, the method returns early.
	 * @returns {Promise<void>}
	 */
	async init() {
		if (select(`#${this.name}`)) return

		let status = DataStore.get(`MTZ.${this.name}`) || false

		const button = this.createButton(status)
		const toggleWrapper = button.querySelector(`.${button.className}-wrapper`)
		const toggleContainer = button.querySelector(".toggle-container")
		this.button = toggleWrapper

		select(this.parent).insertAdjacentElement("beforebegin", button)

		if (this.tooltip)
			new Tooltip("system", toggleContainer, button, this.tooltip, true, 200, 300)

		toggleContainer.addEventListener("click", async () => {

			if (toggleWrapper.classList.contains("disabled") || toggleWrapper.classList.contains("is-animating"))
				return

			DataStore.set(`MTZ.${this.name}`, status = !status)

			toggleContainer.setAttribute("class", `toggle-container animated is-animating`)

			MTZ.playSound(this.toggleSFX, "sfx")

			toggleWrapper.setAttribute("class", `${button.className}-wrapper ${status ? "closed right" : "open"}`)
			await sleep(100)

			this.onToggle(status)

			if (status)
				this.onEnable()
			else
				this.onDisable()

			toggleWrapper.setAttribute("class", `${button.className}-wrapper ${status ? "open right" : "closed"}`)
			await sleep(300)

			toggleContainer.setAttribute("class", `toggle-container animated`)
		})
	}

	/**
	 * Creates a toggle button element with the given status.
	 * @param status The initial status of the toggle button.
	 * @returns The created toggle button element.
	 */
	createButton(status: boolean) {
		const button = document.createElement("div")
		button.id = this.name
		button.className = this.className + "-toggle"

		const wrapper = document.createElement("div")
		wrapper.className = `${button.className}-wrapper ${status ? "open right" : "closed"} ${this.disabled() ? "disabled" : ""}`

		const container = document.createElement("div")
		container.className = "toggle-container animated"

		const open = document.createElement("div")
		open.className = "open"

		const toggle = document.createElement("div")
		toggle.className = "toggle-button animated"

		container.appendChild(open)
		container.appendChild(toggle)
		wrapper.appendChild(container)
		button.appendChild(wrapper)

		return button
	}
}