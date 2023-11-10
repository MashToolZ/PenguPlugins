import MTZ from "../../classes/MTZ"
import MTZPlugin from "../../classes/MTZPlugin"
import Tooltip from "../../classes/Helpers/Tooltip"
import { FetchJSON, select, waitUntil } from "../../classes/Utils"
import { Friend, Group } from "../../classes/Types"
import type { ContextMenu } from "../../classes/Helpers/ContextMenu"

new class extends MTZPlugin {

	constructor() {
		super("GroupInviter", "1.1.0", "Sakurasou")
	}

	override onContextMenu(contextMenu: ContextMenu): void {
		contextMenu.addOptions([{
			type: "Folder",
			index: 0,
			text: "Invite Folder",
			callback: element => this.inviteGroup(element)
		}])
	}

	async inviteGroup(target: HTMLElement) {

		const name = target.closest("lol-social-roster-group")?.children[0]?.getAttribute("data-name")
		if (!name) return

		const groups = await FetchJSON("/lol-chat/v1/friend-groups") as Group[]
		if (!groups) return

		const group = groups.find(group => group.name === name)
		if (!group) return

		const friends = await FetchJSON("/lol-chat/v1/friends") as Friend[]
		if (!friends) return

		const targets = friends.filter(friend => friend.displayGroupId === group.id)
		if (!targets.length) return

		FetchJSON("/lol-lobby/v2/lobby/invitations", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(targets.map(target => ({ toSummonerId: target.summonerId })))
		})
	}
}