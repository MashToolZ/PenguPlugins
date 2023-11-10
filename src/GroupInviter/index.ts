import MTZPlugin from "../../classes/MTZPlugin"
import Tooltip from "../../classes/Helpers/Tooltip"
import { FetchJSON, select, waitUntil } from "../../classes/Utils"
import MTZ from "../../classes/MTZ"

interface Group {
	id: number,
	name: string
}

interface Friend {
	availability: string
	displayGroupId: number
	summonerId: number
}

new class extends MTZPlugin {

	private options = [{
		index: 0,
		text: "Invite Folder",
		requires: "Rename Folder",
		callback: element => this.inviteGroup(element)
	}] as { requires: string, text: string, index: number, callback: Function }[]

	private contextMenuOpen: boolean = false
	private targetElement: HTMLElement

	constructor() {
		super("GroupInviter", "1.0.0", "Sakurasou")
		document.addEventListener("contextmenu", () => this.targetElement = event.target, true)
	}

	contextMenu(contextMenu: HTMLElement) {

		const optionsHolder = contextMenu?.shadowRoot?.querySelector("div.context-menu.context-menu-root")
		if (!optionsHolder) return

		for (const option of this.options)
			this.createOption(contextMenu, optionsHolder, option.index, option.text, option.requires, option.callback)
	}

	update() {
		const socialBar = select(".lol-social-actions-bar.actions")
		if (!socialBar) return

		const contextMenu = select("lol-uikit-context-menu") as HTMLElement
		if (!contextMenu && this.contextMenuOpen) {
			this.contextMenuOpen = false
			return
		}

		if (contextMenu && !this.contextMenuOpen) {
			this.contextMenuOpen = true
			this.contextMenu(contextMenu)
		}
	}

	createOption(contextMenu: HTMLElement, optionsHolder: HTMLElement, index: number = 0, text: string, requires: string, callback: Function) {

		const requirement = [...optionsHolder.children].find((element: HTMLElement) => element.textContent === requires)
		if (!requirement) return

		const div = document.createElement("div")
		div.className = "menu-item"
		div.textContent = text
		optionsHolder.insertBefore(div, optionsHolder.children[index])

		div.addEventListener("click", () => {
			MTZ.playSound("fe/lol-uikit/sfx-uikit-click-generic.ogg", "sfx")
			callback(this.targetElement)
			contextMenu.blur()
		})
	}

	async inviteGroup(targetElement: HTMLElement) {

		const name = targetElement.closest("lol-social-roster-group")?.children[0]?.getAttribute("data-name")
		if (!name) return

		const groups = await FetchJSON("https://127.0.0.1:50407/lol-chat/v1/friend-groups") as Group[]
		if (!groups) return

		const group = groups.find(group => group.name === name)
		if (!group) return


		const friends = await FetchJSON("https://127.0.0.1:50407/lol-chat/v1/friends") as Friend[]
		if (!friends) return

		const targets = friends.filter(friend => friend.displayGroupId === group.id)
		if (!targets.length) return

		FetchJSON("https://127.0.0.1:50407/lol-lobby/v2/lobby/invitations", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(targets.map(target => ({ toSummonerId: target.summonerId })))
		})
	}
}