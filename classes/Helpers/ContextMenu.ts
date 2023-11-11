import { ContextMenuType } from "@Types"

interface ContextMenuOption {
	type: ContextMenuType
	index: number
	text: string
	callback: (target: HTMLElement) => void
}

export class ContextMenu {

	public open: boolean = false
	public type: ContextMenuType = null
	public target: HTMLElement = null
	public menu: HTMLElement = null
	public optionsHolder: HTMLElement = null

	constructor() { }

	addOptions(options: ContextMenuOption[]) {

		if (!this.open || !this.optionsHolder) return

		for (const option of options) {

			if (option.type !== this.type) continue

			const div = document.createElement("div")
			div.className = "menu-item"
			div.textContent = option.text
			this.optionsHolder.insertBefore(div, this.optionsHolder.children[option.index])

			div.addEventListener("click", () => {
				MTZ.playSound("fe/lol-uikit/sfx-uikit-click-generic.ogg", "sfx")
				option.callback(this.target)
				this.menu.blur()
			})
		}
	}
}